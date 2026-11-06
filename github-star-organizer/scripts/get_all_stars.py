import json
from util import run_gh_api


def get_all_stars():
    """Get all GitHub Stars"""
    stars = []
    has_next = True
    cursor = None
    query = """
    query($cursor: String) {
      viewer {
        starredRepositories(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes { id nameWithOwner description }
        }
      }
    }
    """
    while has_next:
        vars = {"cursor": cursor} if cursor else {}
        data = run_gh_api(query, vars)
        if not data or 'data' not in data:
            break
        repo_data = data['data']['viewer']['starredRepositories']
        stars.extend(repo_data['nodes'])
        has_next = repo_data['pageInfo']['hasNextPage']
        cursor = repo_data['pageInfo']['endCursor']

    return stars


if __name__ == "__main__":
    stars = get_all_stars()
    print(json.dumps(stars))