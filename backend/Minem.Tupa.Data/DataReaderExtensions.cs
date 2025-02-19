using Azure.Core.GeoJson;
using Microsoft.Data.SqlClient;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.Data
{
    public static class DataReaderExtensions
    {
        //public static List<T> MapToListDomain<T>(this OracleDataReader dr) where T : new()
        //{
        //    List<T> RetVal = null;
        //    var Entity = typeof(T);
        //    var PropDict = new Dictionary<string, PropertyInfo>();
        //    try
        //    {
        //        if (dr != null && dr.HasRows)
        //        {
        //            RetVal = new List<T>();
        //            var Props = Entity.GetProperties(BindingFlags.Instance | BindingFlags.Public);
        //            PropDict = Props.ToDictionary(p => p.Name.ToUpper(), p => p);
        //            while (dr.Read())
        //            {
        //                T newObject = new T();
        //                object? Val, convertedValue;
        //                PropertyInfo Info;
        //                Type targetType;
        //                for (int Index = 0; Index < dr.FieldCount; Index++)
        //                {
        //                    if (PropDict.ContainsKey(dr.GetName(Index).ToUpper()))
        //                    {
        //                        Info = PropDict[dr.GetName(Index).ToUpper()];
        //                        if ((Info != null) && Info.CanWrite)
        //                        {
        //                            Val = dr.GetValue(Index);
        //                            targetType = Info.PropertyType;
        //                            convertedValue = (Val == DBNull.Value) ? null : Convert.ChangeType(Val, targetType);
        //                            Info.SetValue(newObject, convertedValue, null);
        //                        }
        //                    }
        //                }
        //                RetVal.Add(newObject);
        //            }
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //    finally
        //    {
        //        dr.CloseAsync();
        //    }
        //    return RetVal;
        //}


        public static List<T> MapToListDomain<T>(this OracleDataReader dr) where T : new()
        {
            List<T> RetVal = null;
            var Entity = typeof(T);
            var PropDict = new Dictionary<string, PropertyInfo>();
            try
            {
                if (dr != null && dr.HasRows)
                {
                    RetVal = new List<T>();
                    var Props = Entity.GetProperties(BindingFlags.Instance | BindingFlags.Public);
                    PropDict = Props.ToDictionary(p => p.Name.ToUpper(), p => p);
                    while (dr.Read())
                    {
                        T newObject = new T();
                        object? Val, convertedValue;
                        PropertyInfo Info;
                        Type targetType;
                        for (int Index = 0; Index < dr.FieldCount; Index++)
                        {
                            
                            if (PropDict.ContainsKey(dr.GetName(Index).ToUpper()))
                            {
                                Info = PropDict[dr.GetName(Index).ToUpper()];
                                if ((Info != null) && Info.CanWrite)
                                {
                                    Val = dr.GetValue(Index);
                                    targetType = Nullable.GetUnderlyingType(Info.PropertyType) ?? Info.PropertyType;
                                    if (Val == DBNull.Value)
                                    {
                                        convertedValue = null;
                                    }
                                    else if(targetType == typeof(bool))
                                    {
                                        bool variable = Val.ToString() == "1";
                                        convertedValue = Convert.ChangeType(variable, targetType);
                                    }
                                    else
                                    {
                                        // Utilizamos Convert.ChangeType solo si targetType no es nullable
                                        convertedValue = targetType.IsValueType && Nullable.GetUnderlyingType(targetType) == null
                                            ? Convert.ChangeType(Val, targetType)
                                            : Val;
                                    }
                                    Info.SetValue(newObject, convertedValue, null);
                                }
                            }
                        }
                        RetVal.Add(newObject);
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                dr.CloseAsync();
            }
            return RetVal;
        }


    public static T MapToDomain<T>(this DbDataReader dr) where T : new()
        {
            T RetVal = new T();
            var Entity = typeof(T);
            var PropDict = new Dictionary<string, PropertyInfo>();
            try
            {
                if (dr != null && dr.HasRows)
                {
                    var Props = Entity.GetProperties(BindingFlags.Instance | BindingFlags.Public);
                    PropDict = Props.ToDictionary(p => p.Name.ToUpper(), p => p);

                    object? Val, convertedValue;
                    PropertyInfo Info;
                    Type targetType;
                    dr.Read();
                    for (int Index = 0; Index < dr.FieldCount; Index++)
                    {
                        if (PropDict.ContainsKey(dr.GetName(Index).ToUpper()))
                        {
                            Info = PropDict[dr.GetName(Index).ToUpper()];                            
                            if ((Info != null) && Info.CanWrite)
                            {
                                Val = dr.GetValue(Index);
                                targetType = Nullable.GetUnderlyingType(Info.PropertyType) ?? Info.PropertyType;
                                if (Val == DBNull.Value)
                                {
                                    convertedValue = null;
                                }
                                else if (targetType == typeof(bool))
                                {
                                    bool variable = Val.ToString() == "1";
                                    convertedValue = Convert.ChangeType(variable, targetType);
                                }
                                else
                                {
                                    // Utilizamos Convert.ChangeType solo si targetType no es nullable
                                    convertedValue = targetType.IsValueType && Nullable.GetUnderlyingType(targetType) == null
                                        ? Convert.ChangeType(Val, targetType)
                                        : Val;
                                }
                                Info.SetValue(RetVal, convertedValue, null);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return RetVal;
        }

        public static DbParameterCollection ToArray<TEntity>(this DbParameterCollection parameterList, TEntity entity) where TEntity : class
        {
            Type obj = entity.GetType();
            string name = obj.Name;
            PropertyInfo[] props = obj.GetProperties();

            if (props.Length > 0)
            {
                string str = "";
                foreach (var prop in props)
                {
                    if (prop.GetIndexParameters().Length == 0)
                    {
                        object paramValue = prop.GetValue(entity, null);
                        if (paramValue == null)
                            parameterList.Add(new SqlParameter(string.Format("@{0}", prop.Name), DBNull.Value));
                        else
                        {
                            switch (Type.GetTypeCode(paramValue.GetType()))
                            {
                                case TypeCode.Boolean:
                                    parameterList.Add(new SqlParameter(string.Format("@{0}", prop.Name), (bool)paramValue));
                                    break;
                                case TypeCode.DateTime:
                                    parameterList.Add(new SqlParameter(string.Format("@{0}", prop.Name), (DateTime)paramValue));
                                    break;
                                case TypeCode.Int32:
                                    parameterList.Add(new SqlParameter(string.Format("@{0}", prop.Name), (int)paramValue));
                                    break;
                                case TypeCode.Int64:
                                    parameterList.Add(new SqlParameter(string.Format("@{0}", prop.Name), (long)paramValue));
                                    break;
                                case TypeCode.Double:
                                    parameterList.Add(new SqlParameter(string.Format("@{0}", prop.Name), (double)paramValue));
                                    break;
                                case TypeCode.Decimal:
                                    parameterList.Add(new SqlParameter(string.Format("@{0}", prop.Name), (decimal)paramValue));
                                    break;
                                default:
                                    parameterList.Add(new SqlParameter(string.Format("@{0}", prop.Name), paramValue.ToString()));
                                    break;
                            }
                        }
                    }
                }
            }
            return parameterList;
        }
    }
}
