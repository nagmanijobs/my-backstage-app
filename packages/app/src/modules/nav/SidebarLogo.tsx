import {
  Link,
  sidebarConfig,
  useSidebarOpenState,
} from '@backstage/core-components';
import { makeStyles, Typography } from '@material-ui/core';
import { LogoIcon } from './LogoIcon';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthOpen,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: '100%',
    marginLeft: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#7df3e1',
  },
  title: {
    color: '#7df3e1',
    fontWeight: 700,
    fontSize: '0.9rem',
    lineHeight: 1.1,
    maxWidth: 160,
  },
});

export const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        <LogoIcon />
        {isOpen ? (
          <Typography variant="subtitle2" className={classes.title}>
            SWIVEL Engineering Self Service Portal
          </Typography>
        ) : null}
      </Link>
    </div>
  );
};
