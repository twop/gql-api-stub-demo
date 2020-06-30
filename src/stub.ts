import { Operation, myChats, addMessage } from './operations';

type StubOptions = {
  times: 'at least once' | 'exactly once' | 'whatever';
};

type Stub<I, O> = [Operation<I, O>, (input: I) => O, StubOptions?];

// this is more
// maybe that helper is not needed with more accurate types
const stub = <I, O>(
  operation: Operation<I, O>,
  implementation: (input: I) => O,
  options?: StubOptions
): Stub<I, O> => [operation, implementation];

type Stubs = Stub<any, any>[];

const stubApi = <T extends Stubs>(
  stubs: T
): { run: (testCode: () => Promise<void>) => void } => ({
  run: f => {},
});

// this should be a part of our app
const fetchGql = <I, O>(operation: Operation<I, O>, input: I): Promise<O> =>
  Promise.reject();

stubApi([
  stub(addMessage, ({ chatId, message }) => ({ id: `msg in ${chatId}` })),
  stub(myChats, ({}) => [{ id: 'my chat id #1', messages: [] }], {
    times: 'exactly once',
  }),
]).run(async () => {
  const [firstChat] = await fetchGql(myChats, {});

  const msg = await fetchGql(addMessage, {
    chatId: firstChat.id,
    message: 'hello?',
  });

  if (msg !== null) {
    console.log(msg?.id);
    // "msg in my chat id #1"
  }

  // second time will fail a test because of 'exactly once' semantics
  await fetchGql(myChats, {});
});

//------SEQUENCING-------------
// that is more aligned with API recording tools

type StubResult<I, O> = [Operation<I, O>, I, O, StubOptions?];

const stubResult = <I, O>(
  operation: Operation<I, O>,
  input: I,
  output: O,
  options?: StubOptions
): StubResult<I, O> => [operation, input, output, options];

const stubApiWithSequence = <
  T extends (StubResult<any, any> | Stub<any, any>)[]
>(
  stubs: T
): { run: (testCode: () => Promise<void>) => void } => ({
  run: f => {},
});

stubApiWithSequence([
  stubResult(myChats, {}, [{ id: 'my chat id #1', messages: [] }]),
  stub(addMessage, ({ chatId, message }) => ({ id: `msg in ${chatId}` })),
  stubResult(myChats, {}, [{ id: 'my chat id #2', messages: [] }]),
]).run(async () => {
  /// test code
});

// maybe something even more sophisticated
stubApiWithSequence([
  exactly(
    // which means that calls have to be in this order with this exact input
    stubResult(myChats, {}, [{ id: 'my chat id #1', messages: [] }]),
    stub(addMessage, ({ chatId, message }) => ({ id: `msg in ${chatId}` })),
    stubResult(myChats, {}, [{ id: 'my chat id #2', messages: [] }])
  ),
  anytime(
    // means that anytime after the prev block this call is ok
    stub(addMessage, ({ chatId, message }) => ({ id: `msg in ${chatId}` }))
  ),
]);
