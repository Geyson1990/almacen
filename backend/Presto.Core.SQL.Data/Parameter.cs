using System.Data;

namespace Presto.Core.SQL.Data
{
    public class Parameter
    {
        public Parameter()
        {
        }

        public Parameter(string name, object value, ParameterDirection direction = ParameterDirection.Input)
        {
            this.Name = name;
            this.Value = value;
            this.Direction = direction;
        }

        public Parameter(string name, object value, int size, ParameterDirection direction = ParameterDirection.Input)
        {
            this.Name = name;
            this.Value = value;
            this.Direction = direction;
            this.Size = size;
        }

        public string Name { get; set; }

        public object Value { get; set; }

        public int Size { get; set; }

        public ParameterDirection Direction { get; set; }
    }
}
