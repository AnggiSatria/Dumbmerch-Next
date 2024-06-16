export const users = (set) => {
  return {
    check_auth: {},
    profiles: {},
    handleCheckAuth: (value) =>
      set(() => ({
        check_auth: value,
      })),
    handleProfiles: (value) =>
      set(() => ({
        profiles: value,
      })),
  };
};
