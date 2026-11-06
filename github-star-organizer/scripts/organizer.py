import os
import json
import time
import sys
from util import run_gh_api

# Get the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# stars_with_category.json is in the parent directory of scripts/
STARS_FILE = os.path.join(os.path.dirname(SCRIPT_DIR), 'stars_with_category.json')

def get_existing_lists():
    query = """
    query {
      viewer {
        lists(first: 100) {
          nodes { id name }
        }
      }
    }
    """
    data = run_gh_api(query)
    if data and 'data' in data and 'viewer' in data['data']:
        return {item['name']: item['id'] for item in data['data']['viewer']['lists']['nodes']}
    return {}

def create_list(name):
    query = """
    mutation($name: String!) {
      createUserList(input: { name: $name }) {
        list { id name }
      }
    }
    """
    res = run_gh_api(query, {"name": name})
    if res and 'data' in res and res['data'].get('createUserList'):
        return res['data']['createUserList']['list']['id']
    return None

def add_to_list(list_id, repo_id):
    query = """
    mutation($repoId: ID!, $listIds: [ID!]!) {
      updateUserListsForItem(input: { itemId: $repoId, listIds: $listIds }) { __typename }
    }
    """
    return run_gh_api(query, {"repoId": repo_id, "listIds": list_id})

def main():
    if not os.path.exists(STARS_FILE):
        print(f"❌ Error: {STARS_FILE} not found. Please run the categorization step first.")
        sys.exit(1)

    with open(STARS_FILE, 'r', encoding='utf-8') as f:
        stars = json.load(f)
    
    list_cache = get_existing_lists()
    print(f"📂 Found {len(list_cache)} existing lists.")
    
    print("\nStarting classification and syncing to GitHub...")
    for i, repo in enumerate(stars):
        category = repo["categorizeName"]
        
        if category not in list_cache:
            new_id = create_list(category)
            if new_id:
                list_cache[category] = new_id
                print(f"  ✨ Created new list: '{category}'")
            else:
                print(f"  ⚠️  Failed to create '{category}', skipping {repo['nameWithOwner']}.")
                continue
        
        res = add_to_list(list_cache[category], repo['id'])
        
        status_msg = f"[{i+1}/{len(stars)}] {repo['nameWithOwner']} -> '{category}'"
        if res and 'errors' in res:
            if "already in list" in str(res['errors']):
                print(f"  ⏭️  {status_msg} (already in list)")
            else:
                print(f"  ❌ {status_msg} (failed: {res['errors'][0]['message'][:50]}...)")
        else:
            print(f"  ✅ {status_msg}")
        
        time.sleep(0.3)

    print("\n🎉 All tasks completed! You can now refresh your GitHub Stars page.")

if __name__ == "__main__":
    main()
