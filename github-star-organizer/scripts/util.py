import json
import subprocess
def run_gh_api(query, variables=None, auto_fix=True):
    cmd = ["gh", "api", "graphql", "-f", f"query={query}"]
    if variables:
        for k, v in variables.items():
            cmd.extend(["-F", f"{k}={v}"])
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    # Detect insufficient scopes or missing fields (usually because 'user' scope is missing)
    if result.returncode != 0:
        err_msg = result.stderr
        if auto_fix and ("insufficient scopes" in err_msg.lower() or "doesn't exist on type" in err_msg.lower()):
            print("\n🔑 Insufficient permissions detected (missing 'user' scope), attempting to auto-fix...")
            print("👉 Please complete GitHub authorization in the opened browser window.")
            try:
                # Attempt to refresh permissions
                subprocess.run(["gh", "auth", "refresh", "-s", "user"], check=True)
                print("✅ Permissions refreshed successfully, retrying operation...\n")
                return run_gh_api(query, variables, auto_fix=False) # Retry
            except subprocess.CalledProcessError:
                print("❌ Permission refresh failed. Please run 'gh auth refresh -s user' manually and try again.")
        
        return {"errors": [{"message": err_msg}]}
    return json.loads(result.stdout)
