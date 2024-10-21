import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [files, setFiles] = useState<any[]>([]);
  // const owner = "midnight-ntwrk";
  // const repository = "releases";
  // const branch = "gh-pages";
  // const targetDirectory = "artifacts";
  // const apiUrl = `https://api.github.com/repos/${owner}/${repository}/contents/${targetDirectory}?ref=${branch}`;
  // const cloudFrontUrl = "https://d3fazakqrumx6p.cloudfront.net";

  // useEffect(() => {
  //   fetchContents(apiUrl);
  // }, []);

  // const fetchContents = async (url: string) => {
  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setFiles(data);
  //   } catch (error) {
  //     console.error("Error fetching repository contents:", error);
  //   }
  // };

  const formatFileSize = (size: number) => {
    return size > 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(2)} MB`
      : `${(size / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="App">
      <h1 className="site-title">Midnight Releases</h1>

      <ul>
        {files.map((item) => (
          <li key={item.path}>
            {item.type === "dir" ? (
              <a
                className="listStyle"
                href="#"
                onClick={() => fetchContents(item.url)}
              >
                {item.name}
              </a>
            ) : item.name.endsWith(".link") ? (
              <a
                className="listStyle"
                // href={`${cloudFrontUrl}/${item.name.replace(".link", ".zip")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.name.replace(".link", ".zip")}
              </a>
            ) : (
              <a
                className="listStyle"
                href={item.download_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.name}
                <span>{formatFileSize(item.size)}</span>
              </a>
            )}
          </li>
        ))}
      </ul>

      <div className="text-notice">
        <p>
          These pages contain released versions of various development tools.
        </p>

        <p>
          The <code>compiler</code> directory contains compilers for different
          versions of the Compact language, which are used at Midnight to
          describe smart contracts.
        </p>

        <p>
          Running on a DApp developer's computer, our compiler ingests a{" "}
          <a href="https://docs.midnight.network/develop/tutorial/high-level-arch">
            Compact-language
          </a>{" "}
          contract and produces a collection of JavaScript/TypeScript
          definitions that provide a custom API for a smart contract, the
          cryptographic materials and 'circuit' descriptions needed by the proof
          server to create zero-knowledge proofs to enforce the terms of the
          smart contract while shielding your private data.
        </p>

        <p>
          The <code>examples</code> directory contains sample code for several
          DApps used in the{" "}
          <a href="https://docs.midnight.network/develop/tutorial/">
            Developer tutorial
          </a>
          : welcome, bboard, bboard-tutorial, and counter. More information
          about our examples may be found{" "}
          <a href="https://docs.midnight.network/develop/tutorial/building/examples-repo">
            here
          </a>
          .
        </p>

        <p>
          The <code>vscode</code> directory contains a Visual studio code plugin
          to assist with the development of Compact smart development. More
          information about the plugin may be found{" "}
          <a href="https://docs.midnight.network/develop/tutorial/building/prereqs#optional-visual-studio-code-vscode-extension-for-compact">
            here
          </a>
          .
        </p>

        <p>
          The <code>wallet</code> directory contains a Chrome extension
          Midnight-enabled edition of the Lace wallet. More details about the
          wallet may be found{" "}
          <a href="https://docs.midnight.network/develop/tutorial/using/chrome-ext">
            here
          </a>
          .
        </p>

        <p>
          The <code>Compact compiler</code>,{" "}
          <a href="https://hub.docker.com/r/midnightnetwork/proof-server">
            Proof server
          </a>
          , <code>Midnight-Lace wallet</code>,{" "}
          <a href="https://releases.midnight.network/">VSCode extension</a>,{" "}
          <a href="https://hub.docker.com/u/midnightnetwork">
            Docker images for the proof server and other client services
          </a>
          , and{" "}
          <a href="https://www.npmjs.com/search?q=midnight-ntwrk">
            Node libraries
          </a>{" "}
          are available to you through their respective link.
        </p>
      </div>
    </div>
  );
}

export default App;
