import { createContext, useContext } from "react";

type PageTitleContextType = {
    title: string;
    setTitle: (t: string) => void;
};

export const PageTitleContext = createContext<PageTitleContextType>({
    title: "Dashboard",
    setTitle: () => {},
});

export function useSetPageTitle() {
    return useContext(PageTitleContext).setTitle;
}
