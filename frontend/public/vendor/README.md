# Browser runtime attribution

These vendored JavaScript files are React and ReactDOM UMD production bundles,
originally distributed with Jupyter's nbclassic package. They are React v16.0.x.
Copyright Meta Platforms, Inc. and contributors. Licensed under MIT.
See https://github.com/facebook/react/blob/main/LICENSE .

Why vendored? This build environment could not access npm, so the verified
single-command local build uses the pinned local React production runtime and
precompiled TypeScript (scripts/build_frontend.cjs). Vite source is also included
for developers who wish to modify the UI with npm installed. The UI intentionally
uses class components for compatibility with this runtime.

Note: this is a student prototype. For a public production deployment, upgrade
to a currently supported React runtime, refresh the build and rerun browser tests.
