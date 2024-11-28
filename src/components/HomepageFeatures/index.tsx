import React, { FC, useState } from "react";
import styles from "./styles.module.css";
import Head from "@docusaurus/Head";
import releaseUrls from "./releasesUrls";

const Releases: FC = () => {
  const [compilerPlatform, setCompilerPlatform] = useState<"linux" | "macos">(
    "linux"
  );

  // URLs for each download
  const compilerUrl = releaseUrls.compiler.latest[compilerPlatform];
  const examplesUrl = releaseUrls.examples.latest;
  const vscodeExtensionUrl = releaseUrls.vscode_extension.latest;
  const walletUrl = releaseUrls.wallet.latest;

  return (
    <>
      <div className={styles.background} />
      <div className={styles.releasesWrapper}>
        <Head bodyAttributes={{ "data-releasespage": true }}>{null}</Head>
        <h1 className={styles.IntroHeading}>Midnight Developer Releases</h1>
        <h3 className={styles.IntroStandfirst}>
          Welcome to the Midnight Releases Page. Here, you can download
          essential tools to start building on Midnight, a data protection
          blockchain.
        </h3>
        <h4 className={styles.IntroStandfirstLight}>
          Midnight’s developer toolkit will grow over time. Check back regularly
          for updates and new releases.
        </h4>

        <div className={styles.linkContainer}>
          <div className={styles.downloadOption}>
            <span>Select your OS for the Compiler:</span>
            <button
              className={`${styles.platformSelector} ${
                compilerPlatform === "linux" ? styles.selected : ""
              }`}
              onClick={() => setCompilerPlatform("linux")}
            >
              Linux
            </button>
            <button
              className={`${styles.platformSelector} ${
                compilerPlatform === "macos" ? styles.selected : ""
              }`}
              onClick={() => setCompilerPlatform("macos")}
            >
              macOS
            </button>
          </div>
          <a href={compilerUrl} className={styles.link4} download>
            Download Compiler for{" "}
            {compilerPlatform.charAt(0).toUpperCase() +
              compilerPlatform.slice(1)}
          </a>

          <a href={examplesUrl} className={styles.link4} download>
            Examples
          </a>
          <a href={vscodeExtensionUrl} className={styles.link4} download>
            VSCode Extension
          </a>
          <a href={walletUrl} className={styles.link4} download>
            Wallet
          </a>
        </div>
      </div>
    </>
  );
};

export default Releases;
