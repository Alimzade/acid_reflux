import {
  collection,
  doc,
  documentId,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { firestore } from './firebase';
import { assertDateKey, isDateKey } from './dateKey';
import { emptyDailyQuest } from './questScoring';
import type { DailyQuestDocument, MoveKey, PlayerId } from './types';

const collectionName = 'daily_duo_quest';
const knownExistingDates = new Set<string>();

function getFirestore() {
  if (!firestore) {
    throw new Error('Firebase is not configured. Set all VITE_FIREBASE_* variables to enable sync.');
  }

  return firestore;
}

function questDocument(date: string) {
  assertDateKey(date);
  return doc(getFirestore(), collectionName, date);
}

async function ensureQuestExists(date: string) {
  const questRef = questDocument(date);
  if (knownExistingDates.has(date)) return questRef;

  const database = getFirestore();

  await runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(questRef);

    if (!snapshot.exists()) {
      transaction.set(
        questRef,
        { ...emptyDailyQuest(date), updatedAt: serverTimestamp() },
        { merge: true },
      );
    }
  });

  knownExistingDates.add(date);
  return questRef;
}

export function subscribeToQuest(
  date: string,
  onData: (
    quest: DailyQuestDocument | null,
    fromCache: boolean,
    hasPendingWrites: boolean,
  ) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  assertDateKey(date);
  if (!firestore) {
    onError(new Error('Firebase is not configured. Set all VITE_FIREBASE_* variables to enable sync.'));
    return () => undefined;
  }

  return onSnapshot(
    doc(firestore, collectionName, date),
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.exists()) knownExistingDates.add(date);
      onData(
        snapshot.exists() ? snapshot.data() as DailyQuestDocument : null,
        snapshot.metadata.fromCache,
        snapshot.metadata.hasPendingWrites,
      );
    },
    onError,
  );
}

export interface QuestHistoryEntry {
  date: string;
  quest: DailyQuestDocument;
}

export function subscribeToQuestHistory(
  throughDate: string,
  onData: (entries: QuestHistoryEntry[], fromCache: boolean) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  assertDateKey(throughDate);
  if (!firestore) {
    onError(new Error('Firebase is not configured. Set all VITE_FIREBASE_* variables to enable sync.'));
    return () => undefined;
  }

  const historyQuery = query(
    collection(firestore, collectionName),
    where(documentId(), '<=', throughDate),
    orderBy(documentId(), 'desc'),
  );

  return onSnapshot(
    historyQuery,
    { includeMetadataChanges: true },
    (snapshot) => onData(
      snapshot.docs.flatMap((entry) => {
        if (!isDateKey(entry.id)) return [];
        knownExistingDates.add(entry.id);
        return [{
          date: entry.id,
          quest: entry.data() as DailyQuestDocument,
        }];
      }),
      snapshot.metadata.fromCache,
    ),
    onError,
  );
}

export async function updateMove(
  date: string,
  player: PlayerId,
  move: MoveKey,
  value: boolean,
): Promise<void> {
  const questRef = await ensureQuestExists(date);
  await setDoc(
    questRef,
    {
      players: { [player]: { moves: { [move]: { completed: value } } } },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updateMoveText(
  date: string,
  player: PlayerId,
  move: MoveKey,
  text: string,
): Promise<void> {
  const questRef = await ensureQuestExists(date);
  await setDoc(
    questRef,
    {
      players: { [player]: { moves: { [move]: { text } } } },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updateSentence(
  date: string,
  player: PlayerId,
  sentence: string,
): Promise<void> {
  const questRef = await ensureQuestExists(date);
  await setDoc(
    questRef,
    {
      players: { [player]: { germanSentence: sentence } },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function submitAnswer(
  date: string,
  player: PlayerId,
  answerIndex: number,
): Promise<void> {
  const questRef = await ensureQuestExists(date);
  const database = getFirestore();

  await runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(questRef);
    const currentAnswer = snapshot.data()?.players?.[player]?.answerIndex;

    if (currentAnswer !== null && currentAnswer !== undefined) {
      throw new Error('This answer is already locked.');
    }

    transaction.update(questRef, {
      [`players.${player}.answerIndex`]: answerIndex,
      updatedAt: serverTimestamp(),
    });
  });
}
