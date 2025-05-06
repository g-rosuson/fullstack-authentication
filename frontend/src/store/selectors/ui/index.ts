import { useStore } from 'store';

export const useUserInterfaceSelection = () => ({
    theme: useStore((store) => store.theme)
});