using System.Collections.Generic;
using System.Linq;

namespace Presto.Core.General
{
    public class StatusResponse
    {
        public bool Success { get; set; }

        public int Code { get; set; }

        public string Message { get; set; }


        public List<MessageStatusResponse> Validations { get; set; }

        public StatusResponse() => this.Validations = new List<MessageStatusResponse>();

        public StatusResponse(string message, int code = 200) : this() => this.Validations.Add(new MessageStatusResponse(message, code));

        public void AddValidation(string message, int code = 200) => this.Validations.Add(new MessageStatusResponse(message, code));

        public override string ToString() => string.Join(",", this.Validations.Select(x => x.Message));
    }

    public class StatusResponse<T> : StatusResponse
    {
        public StatusResponse() { }

        public StatusResponse(string message, int code = 200) : base(message, code) { }

        public T Data { get; set; }
    }
}
