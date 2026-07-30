import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

const emulatorAddress = process.env.FIRESTORE_EMULATOR_HOST;
if (process.env.npm_lifecycle_event === 'test:rules' && !emulatorAddress) {
  throw new Error(
    'Firestore rules tests require FIRESTORE_EMULATOR_HOST. '
    + 'Start them with: npm.cmd run test:rules:emulator',
  );
}
const describeWithEmulator = emulatorAddress ? describe : describe.skip;
const projectId = 'demo-daily-duo-quest-rules-test';

function validMove(text = 'Take one step.') {
  return { text, completed: false };
}

function validPlayer() {
  return {
    moves: {
      money: validMove('Review the budget.'),
      health: validMove('Take a walk.'),
      learning: validMove('Read one chapter.'),
    },
    germanSentence: '',
    answerIndex: null,
  };
}

function validQuest() {
  return {
    challengeId: 'german-daily-test',
    players: {
      alizade: validPlayer(),
      sakar: validPlayer(),
    },
    updatedAt: serverTimestamp(),
  };
}

describeWithEmulator('Daily Duo Quest Firestore rules', () => {
  let testEnvironment: RulesTestEnvironment;

  beforeAll(async () => {
    const [host, port] = emulatorAddress!.split(':');
    testEnvironment = await initializeTestEnvironment({
      projectId,
      firestore: {
        host,
        port: Number(port),
        rules: readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  afterEach(async () => {
    await testEnvironment.clearFirestore();
  });

  afterAll(async () => {
    await testEnvironment.cleanup();
  });

  function questDocument(date = '2026-07-30') {
    return doc(
      testEnvironment.unauthenticatedContext().firestore(),
      'daily_duo_quest',
      date,
    );
  }

  async function seedQuest(date = '2026-07-30') {
    await assertSucceeds(setDoc(questDocument(date), validQuest()));
  }

  it('allows public reads and a valid create with initially null answers', async () => {
    const reference = questDocument();
    await assertSucceeds(setDoc(reference, validQuest()));
    await assertSucceeds(getDoc(reference));
    expect((await getDoc(reference)).exists()).toBe(true);
  });

  it('allows valid leap-day IDs and rejects malformed or impossible date IDs', async () => {
    await assertSucceeds(setDoc(questDocument('2024-02-29'), validQuest()));
    for (const date of [
      '2026-7-30',
      '2026-02-29',
      '2026-02-30',
      '2026-04-31',
      '2026-13-01',
      'not-a-date',
    ]) {
      await assertFails(setDoc(questDocument(date), validQuest()));
    }
  });

  it('allows leaf merge updates while preserving the full valid schema', async () => {
    const reference = questDocument();
    await seedQuest();
    await assertSucceeds(updateDoc(reference, {
      'players.alizade.moves.money.text': 'Save ten euros.',
      updatedAt: serverTimestamp(),
    }));
    await assertSucceeds(updateDoc(reference, {
      'players.sakar.moves.health.completed': true,
      updatedAt: serverTimestamp(),
    }));
    await assertSucceeds(updateDoc(reference, {
      'players.alizade.germanSentence': 'Heute lernen wir zusammen.',
      updatedAt: serverTimestamp(),
    }));
  });

  it('requires null answers on create', async () => {
    const quest = validQuest();
    (quest.players.alizade as { answerIndex: number | null }).answerIndex = 1;
    await assertFails(setDoc(questDocument(), quest));
  });

  it('locks each answer independently after its first integer submission', async () => {
    const reference = questDocument();
    await seedQuest();

    await assertSucceeds(updateDoc(reference, {
      'players.alizade.answerIndex': 2,
      updatedAt: serverTimestamp(),
    }));
    await assertSucceeds(updateDoc(reference, {
      'players.sakar.answerIndex': 1,
      updatedAt: serverTimestamp(),
    }));
    await assertSucceeds(updateDoc(reference, {
      'players.alizade.answerIndex': 2,
      'players.alizade.moves.learning.completed': true,
      updatedAt: serverTimestamp(),
    }));
    await assertFails(updateDoc(reference, {
      'players.alizade.answerIndex': 3,
      updatedAt: serverTimestamp(),
    }));
    await assertFails(updateDoc(reference, {
      'players.sakar.answerIndex': null,
      updatedAt: serverTimestamp(),
    }));
  });

  it('rejects invalid answer indexes and answer types', async () => {
    const reference = questDocument();
    await seedQuest();
    for (const answerIndex of [-1, 4, 1.5, '1']) {
      await assertFails(updateDoc(reference, {
        'players.alizade.answerIndex': answerIndex,
        updatedAt: serverTimestamp(),
      }));
    }
  });

  it('rejects invalid field types, empty move text, and oversized values', async () => {
    const invalidQuests = [
      (() => {
        const quest = validQuest();
        quest.players.alizade.moves.money.text = '';
        return quest;
      })(),
      (() => {
        const quest = validQuest();
        quest.players.alizade.moves.money.text = 'x'.repeat(141);
        return quest;
      })(),
      (() => {
        const quest = validQuest();
        quest.players.sakar.germanSentence = 'x'.repeat(201);
        return quest;
      })(),
      (() => {
        const quest = validQuest();
        (quest.players.alizade.moves.money as { completed: unknown }).completed = 'true';
        return quest;
      })(),
      { ...validQuest(), challengeId: '' },
      { ...validQuest(), challengeId: 'x'.repeat(121) },
    ];

    for (const quest of invalidQuests) {
      await assertFails(setDoc(questDocument(), quest));
    }
  });

  it('rejects unknown, missing, and structurally invalid schema fields', async () => {
    await assertFails(setDoc(questDocument(), { ...validQuest(), score: 14 }));

    const missingPlayer = validQuest() as Partial<ReturnType<typeof validQuest>>;
    delete missingPlayer.challengeId;
    await assertFails(setDoc(questDocument(), missingPlayer));

    const unknownPlayer = validQuest() as ReturnType<typeof validQuest> & {
      players: ReturnType<typeof validQuest>['players'] & { stranger?: ReturnType<typeof validPlayer> };
    };
    unknownPlayer.players.stranger = validPlayer();
    await assertFails(setDoc(questDocument(), unknownPlayer));
  });

  it('requires a request-time server timestamp on create and every update', async () => {
    await assertFails(setDoc(questDocument(), {
      ...validQuest(),
      updatedAt: Timestamp.fromMillis(1),
    }));

    await seedQuest();
    await assertFails(updateDoc(questDocument(), {
      'players.alizade.moves.money.completed': true,
      updatedAt: Timestamp.now(),
    }));
  });

  it('denies deletes and every operation on unrelated collections', async () => {
    await seedQuest();
    await assertFails(deleteDoc(questDocument()));

    const unrelated = doc(
      testEnvironment.unauthenticatedContext().firestore(),
      'other_collection',
      '2026-07-30',
    );
    await assertFails(getDoc(unrelated));
    await assertFails(setDoc(unrelated, validQuest()));
    await assertFails(deleteDoc(unrelated));
  });
});
