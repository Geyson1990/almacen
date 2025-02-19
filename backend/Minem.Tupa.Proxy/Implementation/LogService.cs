using Microsoft.Extensions.Configuration;
using Minem.Tupa.Proxy.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.Proxy.Implementation
{
    public class LogService(IConfiguration configuration) : ILogService
    {
        private readonly IConfiguration _configuration = configuration;

        public void WriteLog(string error)
        {
            var PathRepository = "C:\\Log"; //_configuration.GetValue<string>("PathRepository:PathRepositoryLog");
            if (!Directory.Exists(PathRepository)) Directory.CreateDirectory(PathRepository);
            var logName = string.Format("error_administrado_{0}.log", DateTime.Now.ToString("yyyy-MM-dd"));
            string createText = string.Format("{0} {1} {2}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss,fff"), "", error + Environment.NewLine);

            if (!File.Exists(Path.Combine(PathRepository, logName)))
            {
                File.WriteAllText(Path.Combine(PathRepository, logName), createText);
            }

            string appendText = "ERROR" + Environment.NewLine;
            File.AppendAllText(Path.Combine(PathRepository, logName), createText);
        }
    }
}
