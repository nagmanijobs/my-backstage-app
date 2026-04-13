import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import githubActionsPlugin from '@backstage-community/plugin-github-actions/alpha';
import githubWorkflowsPlugin from '@veecode-platform/backstage-plugin-github-workflows/alpha';
import {
  PageBlueprint,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';
import GitHubIcon from '@material-ui/icons/GitHub';
import { navModule } from './modules/nav';
import { GitHubPage } from './components/GitHubPage';

const githubPageModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    PageBlueprint.make({
      name: 'github',
      params: {
        path: '/github',
        title: 'GitHub',
        icon: <GitHubIcon />,
        loader: async () => <GitHubPage />,
      },
    }),
  ],
});

export default createApp({
  features: [catalogPlugin, githubActionsPlugin, githubWorkflowsPlugin, githubPageModule, navModule],
});
