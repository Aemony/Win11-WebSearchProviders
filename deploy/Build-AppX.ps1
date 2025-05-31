# Configuration
$SourceFolder            = "$PSScriptRoot\Source"                                          # Full path to the folder that will make up the packaged AppX
$OutputAppX              = "$PSScriptRoot\Output\_package.msix"                            # Full path to where to save the packaged AppX file
$CertificatePath         = "$PSScriptRoot\_self-signed_w_key.pfx"                          # Full path to the private self-signed certificate
$CertificatePassword     = "MyR3LlLYL0NgNSupRH4rDCer7P4sSW0d"                              # Password for the private self-signed certificate
$WindowsSDK              = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64"   # The Windows SDK folder that conintains MakeAppX.exe and SignTool.exe

# Remove any previous version of the package
If (Test-Path $OutputAppX)
{ Remove-Item $OutputAppX }

# Make the AppX package
.$WindowsSDK\MakeAppx pack /d $SourceFolder /p $OutputAppX

# Sign it using the self-signed certificate
.$WindowsSDK\SignTool sign /a /v /fd SHA256 /f $CertificatePath /p $CertificatePassword $OutputAppX