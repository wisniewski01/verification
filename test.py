import boto3

def delete_all_ebs_snapshots():
    ec2 = boto3.client("ec2")
    paginator = ec2.get_paginator("describe_snapshots")
    
    # Get snapshots owned by the account with pagination
    page_iterator = paginator.paginate(OwnerIds=["self"])
    
    deleted_count = 0
    for page in page_iterator:
        for snapshot in page['Snapshots']:
            snapshot_id = snapshot['SnapshotId']
            try:
                ec2.delete_snapshot(SnapshotId=snapshot_id)
                print(f"Deleted snapshot: {snapshot_id}")
                deleted_count += 1
            except Exception as e:
                print(f"Failed to delete snapshot {snapshot_id}: {e}")
    
    if deleted_count == 0:
        print("No snapshots found.")
    else:
        print(f"Total snapshots deleted: {deleted_count}")

if __name__ == "__main__":
    delete_all_ebs_snapshots()
