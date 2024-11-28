import React, { FC, useState } from "react";
import styles from "./styles.module.css";
import releaseUrls from "./releasesUrls";

const Releases: FC = () => {
  const [compilerPlatform, setCompilerPlatform] = useState<"linux" | "mac">(
    "linux"
  );

  // URLs for each download
  const compilerUrl = releaseUrls.compiler.latest[compilerPlatform];
  const examplesUrl = releaseUrls.examples.latest;
  const vscodeExtensionUrl = releaseUrls.vscode_extension.latest;
  const walletUrl = releaseUrls.wallet.latest;

  return (
    <div className={styles.releasesWrapper}>
      <h1 className={styles.IntroHeading}>Latest Midnight Releases</h1>

      <div className={styles.linkContainer}>
        <div className={styles.downloadOption}>
          <span>Select OS for Compiler:</span>
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
              compilerPlatform === "mac" ? styles.selected : ""
            }`}
            onClick={() => setCompilerPlatform("mac")}
          >
            macOS
          </button>
        </div>
        <a href={compilerUrl} className={styles.link4} download>
          Compiler for {compilerPlatform.charAt(0).toUpperCase() + compilerPlatform.slice(1)}
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
  );
};

export default Releases;
