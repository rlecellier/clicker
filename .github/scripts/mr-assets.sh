#!/usr/bin/env bash
# Manages the throwaway demo files kept on the `mr-assets` branch.
#
#   mr-assets.sh add <pr-number> <directory>   store the files of <directory>
#   mr-assets.sh remove <pr-number>            drop everything stored for the PR
#
# Each run rewrites the branch as a single orphan commit, so removed files do
# not linger in its history. The branch is deleted once nothing is left.
# Needs GH_TOKEN and GITHUB_REPOSITORY.
set -euo pipefail

action="${1:?add or remove}"
pr="${2:?pull request number}"
source_directory="$(realpath "${3:-.}")"

branch=mr-assets
remote="https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
work="$(mktemp -d)"

if git ls-remote --exit-code --heads "$remote" "$branch" >/dev/null; then
  git clone --quiet --depth 1 --branch "$branch" "$remote" "$work"
else
  git init --quiet "$work"
fi

cd "$work"
rm -rf "pr-${pr}"
if [ "$action" = add ]; then
  mkdir "pr-${pr}"
  cp "$source_directory"/* "pr-${pr}/"
fi

if ! compgen -G "pr-*" >/dev/null; then
  git push "$remote" --delete "$branch" 2>/dev/null || true
  exit 0
fi

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git checkout --quiet --orphan rewritten
git add -A
git commit --quiet -m "📸 demo files of the open pull requests"
git push --force "$remote" "rewritten:${branch}"
