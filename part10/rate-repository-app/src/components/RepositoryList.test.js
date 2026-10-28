import { render, screen, within } from '@testing-library/react-native';
import { RepositoryListContainer } from './RepositoryList';


jest.mock('expo-constants', () => ({
  statusBarHeight: 0,
}));

describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', async () => {
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor:
            'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor:
              'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          },
        ],
      };
         
// 1. レンダリングする
      // const result = await render(<RepositoryListContainer repositories={repositories} />);
const { getAllByTestId } = await render(<RepositoryListContainer repositories={repositories} />);//  screen.debug();
const repositoryItems = getAllByTestId('repositoryItem');
const [firstRepositoryItem, secondRepositoryItem] = repositoryItems;

    expect(within(firstRepositoryItem).getByText('jaredpalmer/formik')).toHaveTextContent('jaredpalmer/formik');
      expect(within(firstRepositoryItem).getByText('Build forms in React, without the tears')).toHaveTextContent('Build forms in React, without the tears');

      expect(within(secondRepositoryItem).getByText('async-library/react-async')).toHaveTextContent('async-library/react-async');
      expect(within(secondRepositoryItem).getByText('Flexible promise-based React data loader')).toHaveTextContent('Flexible promise-based React data loader');

    });
  });
});