# Reset Rate Limits Helper Script (PowerShell)
# Usage: .\scripts\reset-limits.ps1 [option] [value]

param(
    [string]$Action = "current",
    [string]$Value = ""
)

$BaseUrl = "http://localhost:3000"
$Endpoint = "/api/dev/reset-limits"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Make-Request {
    param(
        [string]$Url,
        [string]$Description
    )

    Write-ColorOutput "`n=====================================" "Cyan"
    Write-ColorOutput "   Rate Limits Reset Tool" "Cyan"
    Write-ColorOutput "=====================================" "Cyan"
    Write-ColorOutput "`n→ $Description" "Yellow"
    Write-ColorOutput "URL: $Url" "Blue"
    Write-ColorOutput ""

    try {
        $response = Invoke-RestMethod -Uri $Url -Method Get -ErrorAction Stop
        Write-ColorOutput "✓ Response:" "Green"
        $response | ConvertTo-Json -Depth 10
    }
    catch {
        Write-ColorOutput "✗ Request failed: $($_.Exception.Message)" "Red"
    }

    Write-ColorOutput "`n=====================================" "Cyan"
}

switch ($Action) {
    "current" {
        Make-Request "$BaseUrl$Endpoint" "Resetting current user/IP limits"
    }

    "all" {
        Make-Request "$BaseUrl${Endpoint}?all=true" "Resetting ALL limits (guests + users)"
    }

    "user" {
        if ([string]::IsNullOrEmpty($Value)) {
            Write-ColorOutput "Error: userId required" "Red"
            Write-ColorOutput "Usage: .\reset-limits.ps1 user <userId>"
            Write-ColorOutput "Example: .\reset-limits.ps1 user user_2abc123"
            exit 1
        }
        Make-Request "$BaseUrl${Endpoint}?userId=$Value" "Resetting limits for user: $Value"
    }

    "ip" {
        if ([string]::IsNullOrEmpty($Value)) {
            Write-ColorOutput "Error: IP address required" "Red"
            Write-ColorOutput "Usage: .\reset-limits.ps1 ip <ip_address>"
            Write-ColorOutput "Example: .\reset-limits.ps1 ip 192.168.1.1"
            exit 1
        }
        Make-Request "$BaseUrl${Endpoint}?ip=$Value" "Resetting limits for IP: $Value"
    }

    "pattern" {
        if ([string]::IsNullOrEmpty($Value)) {
            Write-ColorOutput "Error: Redis pattern required" "Red"
            Write-ColorOutput "Usage: .\reset-limits.ps1 pattern <pattern>"
            Write-ColorOutput "Example: .\reset-limits.ps1 pattern 'messages:user:*'"
            exit 1
        }
        $encodedPattern = [System.Web.HttpUtility]::UrlEncode($Value)
        Make-Request "$BaseUrl${Endpoint}?pattern=$encodedPattern" "Resetting limits matching pattern: $Value"
    }

    "help" {
        Write-ColorOutput "`nUsage: .\reset-limits.ps1 [option] [value]`n"
        Write-ColorOutput "Options:"
        Write-ColorOutput "  current          Reset current user/IP limits (default)"
        Write-ColorOutput "  all              Reset ALL limits (guests + users)"
        Write-ColorOutput "  user <userId>    Reset specific Clerk user limits"
        Write-ColorOutput "  ip <ip>          Reset specific guest IP limits"
        Write-ColorOutput "  pattern <pat>    Reset using Redis pattern"
        Write-ColorOutput "  help             Show this help message"
        Write-ColorOutput "`nExamples:"
        Write-ColorOutput "  .\reset-limits.ps1                                 # Reset current user"
        Write-ColorOutput "  .\reset-limits.ps1 all                             # Reset everything"
        Write-ColorOutput "  .\reset-limits.ps1 user user_2abc123xyz            # Reset specific user"
        Write-ColorOutput "  .\reset-limits.ps1 ip 192.168.1.1                  # Reset specific IP"
        Write-ColorOutput "  .\reset-limits.ps1 pattern 'messages:user:*'       # Reset all user messages"
        Write-ColorOutput ""
    }

    default {
        Write-ColorOutput "Error: Unknown option '$Action'" "Red"
        Write-ColorOutput "Run '.\reset-limits.ps1 help' for usage information"
        exit 1
    }
}
