export const transaction = (set) => {
  return {
    transactions: {},
    transactionById: {},
    handleTransaction: (value) =>
      set(() => ({
        transactions: value,
      })),
    handleTransactionById: (value) =>
      set(() => ({
        transactionById: value,
      })),
  };
};
