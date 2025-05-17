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
  }
};

export default Utils;
