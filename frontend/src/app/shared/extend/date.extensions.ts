export { }

// DATE EXTENSIONS
// ================

declare global {
    interface Date {
        addDays(days: number): Date;
        toStringFecha(): string;
        toStringFechaDGAC(): string; 
    }
}

Date.prototype.addDays = function (days: number): Date {
    let date: Date = this;
    date.setDate(date.getDate() + days);
    return date;
};

Date.prototype.toStringFecha = function (): string {
    let date: Date = this;
    return date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + 'T00:00:00';
};

Date.prototype.toStringFechaDGAC = function (): string {
  let date: Date = this;
  return ('0' + date.getDate()).slice(-2) + '/' +
      ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
      date.getFullYear();
};