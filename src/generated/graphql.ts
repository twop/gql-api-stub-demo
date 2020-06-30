import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};


export type Query = {
  __typename?: 'Query';
  me: User;
  user?: Maybe<User>;
  allUsers?: Maybe<Array<Maybe<User>>>;
  search: Array<SearchResult>;
  myChats: Array<Chat>;
  chat?: Maybe<Chat>;
};


export type QueryuserArgs = {
  id: Scalars['ID'];
};


export type QuerysearchArgs = {
  term: Scalars['String'];
};


export type QuerychatArgs = {
  id: Scalars['ID'];
};

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export type Node = {
  id: Scalars['ID'];
};

export type SearchResult = User | Chat | ChatMessage;

export type User = Node & {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  role: Role;
};

export type Chat = Node & {
  __typename?: 'Chat';
  id: Scalars['ID'];
  users: Array<User>;
  messages: Array<ChatMessage>;
};

export type ChatMessage = Node & {
  __typename?: 'ChatMessage';
  id: Scalars['ID'];
  content: Scalars['String'];
  time: Scalars['Date'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  postMessage?: Maybe<ChatMessage>;
};


export type MutationpostMessageArgs = {
  message: Scalars['String'];
  chatId: Scalars['ID'];
};

export type findUserQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type findUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )> }
);

export type UserFieldsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'role'>
);

export type getChatQueryVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type getChatQuery = (
  { __typename?: 'Query' }
  & { chat?: Maybe<(
    { __typename?: 'Chat' }
    & { messages: Array<(
      { __typename?: 'ChatMessage' }
      & Pick<ChatMessage, 'id' | 'content'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id'>
      ) }
    )> }
  )> }
);

export type myChatsQueryVariables = Exact<{ [key: string]: never; }>;


export type myChatsQuery = (
  { __typename?: 'Query' }
  & { myChats: Array<(
    { __typename?: 'Chat' }
    & Pick<Chat, 'id'>
    & { messages: Array<(
      { __typename?: 'ChatMessage' }
      & Pick<ChatMessage, 'id' | 'content'>
    )> }
  )> }
);

export type addMessageMutationVariables = Exact<{
  message: Scalars['String'];
  chatId: Scalars['ID'];
}>;


export type addMessageMutation = (
  { __typename?: 'Mutation' }
  & { postMessage?: Maybe<(
    { __typename?: 'ChatMessage' }
    & Pick<ChatMessage, 'id'>
  )> }
);

export const UserFields = gql`
    fragment UserFields on User {
  id
  username
  role
}
    `;
export const findUser = gql`
    query findUser($userId: ID!) {
  user(id: $userId) {
    ...UserFields
  }
}
    ${UserFields}`;
export const getChat = gql`
    query getChat($chatId: ID!) {
  chat(id: $chatId) {
    messages {
      id
      content
      user {
        id
      }
    }
  }
}
    `;
export const myChats = gql`
    query myChats {
  myChats {
    id
    messages {
      id
      content
    }
  }
}
    `;
export const addMessage = gql`
    mutation addMessage($message: String!, $chatId: ID!) {
  postMessage(message: $message, chatId: $chatId) {
    id
  }
}
    `;