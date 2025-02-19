using System;
using System.Configuration;

namespace Minem.Tupa.Infraestructure
{
    public static class Configurations
    {
        public static string ConnectionString => ConfigurationManager.ConnectionStrings["TupaDigitalCn"].ConnectionString;

        public static string mensajeSTD => ConfigurationManager.AppSettings.Get("mensajeSTD");
        public static string asuntoTUPA => ConfigurationManager.AppSettings.Get("asuntoTUPA");
        public static string consultaSTD => ConfigurationManager.AppSettings.Get("consultaSTD");
        public static string hostClient => ConfigurationManager.AppSettings.Get("hostClient");
        //public static string MasterKey => ConfigurationManager.AppSettings.Get("masterKey");
        public static string UserTupa => ConfigurationManager.AppSettings.Get("userTupa");
        public static string PasswordTupa => ConfigurationManager.AppSettings.Get("passwordTupa");

        public static string emailSutran => ConfigurationManager.AppSettings.Get("emailSutran");
        public static string UrlAgaEnviroment => ConfigurationManager.AppSettings.Get("UrlAgaEnviroment");
        public static string UrlFileGlosa => ConfigurationManager.AppSettings.Get("UrlFileGlosa");

        public static string UrlPaymentService => ConfigurationManager.AppSettings.Get("urlPaymentService");

        public static string BaseurlAPI => ConfigurationManager.AppSettings.Get("BaseurlAPI");
        public static string directory => ConfigurationManager.AppSettings.Get("directory");
        public static string MULTI_PLATAFORM => ConfigurationManager.AppSettings.Get("MULTI_PLATAFORM");
        public static string RUTA_REFIRMAWEB_IMAGES => ConfigurationManager.AppSettings.Get("RUTA_REFIRMAWEB_IMAGES");
        public static string UserWsReniec => ConfigurationManager.AppSettings.Get("usrWsReniec");
        public static string PasswordWsReniec => ConfigurationManager.AppSettings.Get("pwdWsReniec");
        public static string SignaturePassword => ConfigurationManager.AppSettings.Get("signaturePassword");

        public static string SignatureSignName => ConfigurationManager.AppSettings.Get("signatureSignName");
        public static string SignatureSignType => ConfigurationManager.AppSettings.Get("signatureSignType");
        public static string SignatureSource => ConfigurationManager.AppSettings.Get("signatureSource");
        public static bool SendSignedFile => Convert.ToBoolean(ConfigurationManager.AppSettings.Get("SendSignedFile"));
        public static bool SaveResponseSunat => Convert.ToBoolean(ConfigurationManager.AppSettings.Get("SaveResponseSunat"));
        public static bool CheckPersonaJuridica => Convert.ToBoolean(ConfigurationManager.AppSettings.Get("CheckPj"));
        public static bool CheckPersonaNatural => Convert.ToBoolean(ConfigurationManager.AppSettings.Get("CheckPn"));
        public static int RucUserLengthValid => Convert.ToInt32(ConfigurationManager.AppSettings.Get("RucUserLengthValid"));
        public static int RucLengthValid => Convert.ToInt32(ConfigurationManager.AppSettings.Get("RucLengthValid"));
        public static string UrlLoginSunat => ConfigurationManager.AppSettings.Get("UrlLoginSunat");
        public static string RootWebApi => ConfigurationManager.AppSettings.Get("root_web_api");
        public static string EmoWhatsApp => ConfigurationManager.AppSettings.Get("textNotiWspRegUsu");
        public static bool CheckWhatsApp => Convert.ToBoolean(ConfigurationManager.AppSettings.Get("CheckWhApp"));

        public static string PrefixPersonaJuridica => ConfigurationManager.AppSettings.Get("PrefixPj");
        public static string PrefixPersonaNatural => ConfigurationManager.AppSettings.Get("PrefixPn");
        public static string UrlViewerSharepoint => ConfigurationManager.AppSettings.Get("UrlViewerSharepoint");
        public static string UrlRepositorySharepoint => ConfigurationManager.AppSettings.Get("UrlRepositorySharepoint");
        public static string PathRepositoryCivic => ConfigurationManager.AppSettings.Get("PathRepositoryCivic");
        public static string PathRepositoryForm => ConfigurationManager.AppSettings.Get("PathRepositoryForm");
        public static string PathRepositoryCc => ConfigurationManager.AppSettings.Get("PathRepositoryCc");
        public static string PathRepositoryFunctionary => ConfigurationManager.AppSettings.Get("PathRepositoryFunctionary");
        public static string PathRepositoryPhoto => ConfigurationManager.AppSettings.Get("PathRepositoryPhoto");
        public static string PathRepositoryCustom => ConfigurationManager.AppSettings.Get("PathRepositoryCustom");
        public static string PathRepositoryResponse => ConfigurationManager.AppSettings.Get("PathRepositoryResponse");
        public static string PathSignedOrigin => ConfigurationManager.AppSettings.Get("PathSignedOrigin");
        public static string PathSignedDest => ConfigurationManager.AppSettings.Get("PathSignedDest");
        public static string UserPhotoDefault => ConfigurationManager.AppSettings.Get("UserPhotoDefault");

        public static string PrivateKeyRecaptcha => ConfigurationManager.AppSettings.Get("PrivateKeyRecaptcha");

        public static string ExcludeReniecField => ConfigurationManager.AppSettings.Get("ExcludeReniecField");
        public static string UbigeoReniecValue => ConfigurationManager.AppSettings.Get("UbigeoReniecValue");
        public static int NumberReniecField => Convert.ToInt32(ConfigurationManager.AppSettings.Get("NumberReniecField"));

        public static int TrysReniecValidation => Convert.ToInt32(ConfigurationManager.AppSettings.Get("TrysReniecValidation"));

        public static string HostServer => ConfigurationManager.AppSettings.Get("hostServer");

        public static string ReniecField(string field)
        {
            return ConfigurationManager.AppSettings.Get(string.Format("{0}ReniecField", field));
        }
        public static string TipoExpedienteUnoSTD => ConfigurationManager.AppSettings.Get("tipoExpedienteUnoSTD");
        public static bool IgnoreHorarioAtencion => Convert.ToBoolean(ConfigurationManager.AppSettings.Get("IgnoreHorarioAtencion"));

        public static double addTimeInMinSTD => Convert.ToDouble(ConfigurationManager.AppSettings.Get("addTimeInMinSTD"));
        public static int NumIntentosPermitidos => Convert.ToInt32(ConfigurationManager.AppSettings.Get("NumIntentosPermitidos"));
        public static int timMinExpToken => Convert.ToInt32(ConfigurationManager.AppSettings.Get("timMinExpToken"));
        public static string AppDataPath => ConfigurationManager.AppSettings.Get("AppDataPath");
        public static string imagenLogo => ConfigurationManager.AppSettings.Get("imagenLogo");
        public static string imagenFootTUPA => ConfigurationManager.AppSettings.Get("imagenFootTUPA");
        public static string msgDomicilioElectronico => ConfigurationManager.AppSettings.Get("msgDomicilioElectronico");
        public static string rutaDomicilioElectronico => ConfigurationManager.AppSettings.Get("rutaDomicilioElectronico");
        public static string imagenSAIP => ConfigurationManager.AppSettings.Get("imagenSAIP");

        public static class Aga
        {
            public static bool Sign => Convert.ToBoolean(ConfigurationManager.AppSettings.Get("agaSign"));
            public static bool Notification => Convert.ToBoolean(ConfigurationManager.AppSettings.Get("agaNotification"));
            public static string Uri => ConfigurationManager.AppSettings.Get("agaUri");
            public static string CertificateId => ConfigurationManager.AppSettings.Get("agaCertificateId");
            public static string SecretPassword => ConfigurationManager.AppSettings.Get("agaSecretPassword");
            public static string Timestamp => ConfigurationManager.AppSettings.Get("agaTimestamp");
        }
        public static string Path7z => ConfigurationManager.AppSettings.Get("path7z");
        public static class Sunat
        {
            public static bool OauthDeveloper => Convert.ToBoolean(ConfigurationManager.AppSettings.Get("SunatOauthDeveloper"));
            public static string GrantType => ConfigurationManager.AppSettings.Get("SunatGrantType");
            public static string Scope => ConfigurationManager.AppSettings.Get("SunatScope");
            public static string ClientId => ConfigurationManager.AppSettings.Get("SunatClientId");
            public static string ClientSecret => ConfigurationManager.AppSettings.Get("SunatClientSecret");
            public static string Jwt => ConfigurationManager.AppSettings.Get("SunatJwt");
        }

        public static class Casiel
        {
            public static string Uri => ConfigurationManager.AppSettings.Get("CasielUri");
            public static string Type => ConfigurationManager.AppSettings.Get("CasielType");
            public static string Scope => ConfigurationManager.AppSettings.Get("CasielScope");
            public static string ClientId => ConfigurationManager.AppSettings.Get("CasielClientId");
            public static string ClientUser => ConfigurationManager.AppSettings.Get("CasielClientUser");
            public static string ClientPassword => ConfigurationManager.AppSettings.Get("CasielClientPassword");
        }

        public static class IdPeru
        {
            public static string Redirect => ConfigurationManager.AppSettings.Get("idPeruRedirect");
            public static string File => ConfigurationManager.AppSettings.Get("idPeruFile");
        }
    }
}
