# Relaunch PowerShell as an elevated process with the permissions required to import the self-signed certificate.
if (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator'))
{
    $ScriptPath = $MyInvocation.MyCommand.Path

    If ($args)
    {
        $Path = $args[0]
        Start-Process powershell.exe "-ExecutionPolicy Bypass -File",('"{0}" "{1}"' -f $ScriptPath, $Path) -Verb RunAs
    } Else {
        Start-Process powershell.exe "-ExecutionPolicy Bypass -File",('"{0}"' -f $ScriptPath) -Verb RunAs
    }

    # Close this instance as it has done its job
    Exit $LastExitCode
}

Import-Certificate -CertStoreLocation "Cert:\LocalMachine\TrustedPeople" -FilePath "$PSScriptRoot\_self-signed.cer"

# Install the AppX package
Add-AppxPackage "$PSScriptRoot\_package.msix"