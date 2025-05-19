const Utils = {
  convertToReal: (value: number): string => {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  },
  convertToDateDDMMYY: (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },
  upperCaseFirstLetter: (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  },
  getFirstDayOfYear: () => {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  },
  getLastDayOfYear: () => {
    const currentYear = new Date().getFullYear();
    const endDate = new Date(currentYear, 11, 31);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  }
};

export default Utils;
