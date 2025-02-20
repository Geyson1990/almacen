using System;
using System.Collections.Generic;
using System.Text;

namespace Presto.Core.General
{
    public class MessageStatusResponse
    {
        public int Code { get; }

        public string Message { get; }

        public MessageStatusResponse(string message, int code = 200)
        {
            this.Message = message;
            this.Code = code;
        }
    }
}
