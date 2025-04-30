param(
    [Parameter(Mandatory=$true)]
    [string]$BranchName,
    
    [Parameter(Mandatory=$false)]
    [int]$NumberOfCommits = 5,
    
    [Parameter(Mandatory=$false)]
    [string]$StartDate = "2025-03-01",
    
    [Parameter(Mandatory=$false)]
    [string]$EndDate = "2025-04-25"
)

# Function to generate a random date between two dates
function Get-RandomDate {
    param (
        [DateTime]$StartDate,
        [DateTime]$EndDate
    )
    
    $TimeSpan = New-TimeSpan -Start $StartDate -End $EndDate
    $RandomTime = Get-Random -Minimum 0 -Maximum $TimeSpan.TotalSeconds
    $RandomDate = $StartDate.AddSeconds($RandomTime)
    
    return $RandomDate.ToString("yyyy-MM-dd HH:mm:ss")
}

# Function to make a simple change to a file
function Make-FileChange {
    param(
        [int]$CommitNumber
    )
    
    # Create or update a dummy file
    $fileName = "dummy-commit-file.txt"
    
    if (-not (Test-Path $fileName)) {
        New-Item -Path $fileName -ItemType File -Force | Out-Null
    }
    
    # Append some content to simulate a change
    "Change for commit #$CommitNumber - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -FilePath $fileName -Append
    
    return $fileName
}

# Start of main script
Write-Host "Starting backdated commit process for branch: $BranchName" -ForegroundColor Cyan

# Check if the branch exists
$branchExists = git branch --list $BranchName
if (-not $branchExists) {
    Write-Host "Branch $BranchName does not exist. Creating it now..." -ForegroundColor Yellow
    git checkout -b $BranchName
} else {
    Write-Host "Checking out existing branch $BranchName..." -ForegroundColor Yellow
    git checkout $BranchName
}

# Convert date strings to DateTime objects
$startDateTime = [DateTime]::ParseExact($StartDate, "yyyy-MM-dd", $null)
$endDateTime = [DateTime]::ParseExact($EndDate, "yyyy-MM-dd", $null)

# Create the specified number of commits with random dates
for ($i = 1; $i -le $NumberOfCommits; $i++) {
    # Generate a random date between start and end dates
    $randomDate = Get-RandomDate -StartDate $startDateTime -EndDate $endDateTime
    
    # Make a simple change to create a commit
    $changedFile = Make-FileChange -CommitNumber $i
    
    # Stage the change
    git add $changedFile
    
    # Create the backdated commit
    Write-Host "Creating commit $i with date: $randomDate" -ForegroundColor Green
    $env:GIT_AUTHOR_DATE = $randomDate
    $env:GIT_COMMITTER_DATE = $randomDate
    git commit -m "Backdated commit #$i - $randomDate"
    
    # Sleep briefly to ensure commits have different timestamps
    Start-Sleep -Seconds 1
}

# Push the changes to the remote repository
Write-Host "Pushing changes to origin/$BranchName..." -ForegroundColor Cyan
git push origin $BranchName

Write-Host "Done! Successfully created $NumberOfCommits backdated commits on branch $BranchName" -ForegroundColor Green