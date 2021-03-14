import React, { ReactNode, useEffect, useState } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory,
} from "react-router-dom";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import "./App.css";

const PAGE_TRANSITION_DURATION = 500;

const pageTransition = {
  transition: {
    duration: PAGE_TRANSITION_DURATION / 1000,
    stiffness: 800,
    ease: "easeOut",
  },
  variants: {
    initial: {
      background: "#fff",
      x: "100vw",
    },
    animate: {
      background: "#fff",
      x: 0,
    },
    shrinkBack: {
      opacity: 0.75,
      background: "#ddd",
      x: "-25vw",
    },
    exit: {
      background: "#fff",
      x: "100vw",
    },
  },
};

const Page = ({
  transitionKey,
  transition = false,
  child = false,
  zIndex = 0,
  children,
}: {
  transitionKey: string;
  transition?: boolean;
  child?: boolean;
  zIndex?: number;
  children: ReactNode;
}) => {
  return (
    <motion.div
      className="page"
      key={transitionKey}
      initial="initial"
      animate={child ? "shrinkBack" : "animate"}
      exit="exit"
      variants={transition ? pageTransition.variants : undefined}
      transition={transition ? pageTransition.transition : undefined}
      style={{
        zIndex,
      }}
    >
      {children}
    </motion.div>
  );
};

const backBtnTransition = {
  transition: {
    duration: PAGE_TRANSITION_DURATION / 1000,
    ease: "linear",
  },
  variants: {
    show: {
      opacity: 1,
      display: "initial",
    },
    hide: {
      opacity: 0,
      transitionEnd: {
        display: "none",
      },
    },
  },
};

const Header = ({ root = true }: { root?: boolean }) => {
  const { goBack } = useHistory();

  return (
    <AnimateSharedLayout>
      <header className="header__wrapper">
        <span>
          <motion.button
            transition={backBtnTransition.transition}
            variants={backBtnTransition.variants}
            initial="hide"
            animate={root ? "hide" : "show"}
            onClick={goBack}
            className="header__back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </motion.button>
          <AnimatePresence>
            {!root && (
              <motion.span
                className="header__title  header__title--left"
                layoutId="header-title"
              >
                back
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        {root && (
          <motion.span className="header__title" layoutId="header-title">
            home
          </motion.span>
        )}
      </header>
    </AnimateSharedLayout>
  );
};

const Lorem = () => (
  <div>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate impedit
      temporibus earum possimus consectetur. Dolores, in, consequuntur
      blanditiis nisi animi quod vel odit reprehenderit sapiente debitis aut,
      velit itaque sit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate impedit
      temporibus earum possimus consectetur. Dolores, in, consequuntur
      blanditiis nisi animi quod vel odit reprehenderit sapiente debitis aut,
      velit itaque sit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate impedit
      temporibus earum possimus consectetur. Dolores, in, consequuntur
      blanditiis nisi animi quod vel odit reprehenderit sapiente debitis aut,
      velit itaque sit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate impedit
      temporibus earum possimus consectetur. Dolores, in, consequuntur
      blanditiis nisi animi quod vel odit reprehenderit sapiente debitis aut,
      velit itaque sit.
    </p>
  </div>
);

function Router() {
  const location = useLocation(),
    [lastLocation, setLastLocation] = useState<any>(location);

  useEffect(() => {
    const noDelay =
      [location.pathname, lastLocation?.pathname].includes("/") ||
      !lastLocation?.pathname.includes(location.pathname);

    if (noDelay) setLastLocation(location);
    else {
      const toID = setTimeout(() => {
        if (location) setLastLocation(location);
      }, PAGE_TRANSITION_DURATION);
      return () => clearTimeout(toID);
    }
  }, [location, lastLocation?.pathname]);

  return (
    <>
      <Header root={location.pathname === "/"} />

      <AnimatePresence>
        {["/", "/more", "/more/more"].map(
          (path, idx, paths) =>
            location.pathname.includes(path) && (
              <Switch key={path} location={lastLocation}>
                <Route path={path}>
                  <Page
                    transitionKey={path}
                    child={
                      location.pathname !== path &&
                      location.pathname.includes(path)
                    }
                    zIndex={idx + 1}
                    transition
                  >
                    <h2>{path}</h2>
                    {idx < paths.length && (
                      <Link to={paths[idx + 1]}>{paths[idx + 1]}</Link>
                    )}
                    <Lorem />
                  </Page>
                </Route>
              </Switch>
            )
        )}
      </AnimatePresence>
    </>
  );
}

const App = () => (
  <BrowserRouter>
    <main className="main">
      <Router />
    </main>
  </BrowserRouter>
);

export default App;
