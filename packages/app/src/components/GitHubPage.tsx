import React, { useEffect, useMemo, useState } from 'react';
import {
  Content,
  Header,
  InfoCard,
  Page,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

type RepoRow = {
  entityName: string;
  entityKind: string;
  repoSlug: string;
};

const GITHUB_PROJECT_SLUG_ANNOTATION = 'github.com/project-slug';

function toRepoRow(entity: Entity): RepoRow | undefined {
  const repoSlug = entity.metadata.annotations?.[GITHUB_PROJECT_SLUG_ANNOTATION];
  if (!repoSlug) {
    return undefined;
  }

  return {
    entityName: entity.metadata.name,
    entityKind: entity.kind,
    repoSlug,
  };
}

export const GitHubPage = () => {
  const catalogApi = useApi(catalogApiRef);
  const [rows, setRows] = useState<RepoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(undefined);

        const response = await catalogApi.getEntities();
        const collected = response.items
          .filter(entity => entity.kind === 'Component' || entity.kind === 'API')
          .map(toRepoRow)
          .filter((row): row is RepoRow => Boolean(row));

        const deduped = Array.from(
          new Map(collected.map(row => [row.repoSlug, row])).values(),
        ).sort((a, b) => a.repoSlug.localeCompare(b.repoSlug));

        if (mounted) {
          setRows(deduped);
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : 'Failed to load GitHub data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [catalogApi]);

  const hasRows = useMemo(() => rows.length > 0, [rows.length]);

  return (
    <Page themeId="tool">
      <Header title="GitHub" subtitle="Repositories discovered from catalog annotations" />
      <Content>
        {loading && <Progress />}
        {error && <WarningPanel title="Could not load GitHub repositories">{error}</WarningPanel>}
        {!loading && !error && (
          <InfoCard title="GitHub Repositories">
            {!hasRows && (
              <p>
                No entities with the annotation {GITHUB_PROJECT_SLUG_ANNOTATION} were found.
              </p>
            )}
            {hasRows && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Repository</th>
                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Entity</th>
                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Kind</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.repoSlug}>
                      <td style={{ padding: '8px 0' }}>
                        <a
                          href={`https://github.com/${row.repoSlug}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {row.repoSlug}
                        </a>
                      </td>
                      <td style={{ padding: '8px 0' }}>{row.entityName}</td>
                      <td style={{ padding: '8px 0' }}>{row.entityKind}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </InfoCard>
        )}
      </Content>
    </Page>
  );
};
