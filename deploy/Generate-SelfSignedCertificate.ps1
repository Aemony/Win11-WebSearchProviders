$CertificateFriendlyName = "DONOTTRUST Aemony Experimental Self-Signed Certificate"
$CertificateSubject      = "CN=DONOTTRUST.Aemony.Experimental, O=Aemony, C=Sweden"

$CertificatePath         = "$PSScriptRoot\_self-signed_w_key.pfx"    # Full path to the private self-signed certificate
$CertificatePublicPath   = "$PSScriptRoot\Output\_self-signed.cer"   # Full path where to export the public certificate
$CertificatePassword     = "MyR3LlLYL0NgNSupRH4rDCer7P4sSW0d"        # Password for the private self-signed certificate
$CertificateLocation     = "Cert:\CurrentUser\My\"

# Generate self-signed certificate
$NewCert = New-SelfSignedCertificate -Type Custom -KeyUsage DigitalSignature -CertStoreLocation $CertificateLocation -Subject $CertificateSubject -FriendlyName $CertificateFriendlyName -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")

# Export to PFX (cert + private key)
$SecurePFXPassword = ConvertTo-SecureString -String $CertificatePassword -Force -AsPlainText
Export-PfxCertificate -Cert "$CertificateLocation$($NewCert.Thumbprint)" -FilePath $CertificatePath -Password $SecurePFXPassword

# Export to CERT (public cert only)
Export-Certificate    -Cert "$CertificateLocation$($NewCert.Thumbprint)" -FilePath $CertificatePublicPath

# Import public cert to local Computer\Trusted People store
Import-Certificate -CertStoreLocation "Cert:\LocalMachine\TrustedPeople" -FilePath $CertificatePublicPath