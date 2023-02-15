import { LindyIcon, useModalState } from "@unclutter/library-components/dist/components";
import Head from "next/head";
import { useRouter } from "next/router";

import { reportEventPosthog } from "../../common/metrics";
import {
    FilterContext,
    ModalStateContext,
} from "@unclutter/library-components/dist/components/Modal/context";
import { useAutoDarkMode } from "@unclutter/library-components/dist/common";
import { ReplicacheContext, useSubscribe } from "@unclutter/library-components/dist/store";
import { useContext } from "react";
import RecentModalTab from "@unclutter/library-components/dist/components/Modal/Recent";
import StatsModalTab from "@unclutter/library-components/dist/components/Modal/Stats";
import QuotesTab from "@unclutter/library-components/dist/components/Modal/Quotes";
import SettingsModalTab from "@unclutter/library-components/dist/components/Modal/Settings";
import Sidebar from "@unclutter/library-components/dist/components/Modal/Sidebar";

export default function NewModalApp() {
    const router = useRouter();
    const pathName = router.asPath.split("?")[0];

    const darkModeEnabled = useAutoDarkMode();
    const {
        currentTab,
        setCurrentTab,
        currentSubscription,
        setCurrentSubscription,
        domainFilter,
        setDomainFilter,
        tagFilter,
        setTagFilter,
        showDomain,
    } = useModalState("list", undefined, undefined, reportEventPosthog);

    const rep = useContext(ReplicacheContext);
    const userInfo = useSubscribe(rep, rep?.subscribe.getUserInfo(), null);
    if (!userInfo) {
        return <></>;
    }

    return (
        <div className="font-text min-h-screen bg-stone-100 text-stone-800 dark:bg-[#212121] dark:text-[rgb(232,230,227)]">
            <Head>
                <title>Unclutter</title>
            </Head>

            <FilterContext.Provider
                value={{
                    currentArticle: undefined,
                    currentSubscription,
                    domainFilter,
                    tagFilter,
                    setDomainFilter,
                    showDomain,
                    setTagFilter,
                    setCurrentSubscription,
                    relatedLinkCount: undefined,
                }}
            >
                <ModalStateContext.Provider
                    value={{
                        darkModeEnabled,
                        showSignup: false,
                        userInfo,
                        reportEvent: reportEventPosthog,
                    }}
                >
                    <div className="font-text flex h-full items-stretch overflow-hidden text-base">
                        <aside className="left-side m-4 w-56">
                            <div className="fixed flex flex-col rounded-lg bg-white p-4 shadow-sm">
                                <div className="mb-4 flex w-full items-center gap-2">
                                    <LindyIcon className="w-8" />

                                    <h1
                                        className="font-title select-none text-2xl font-bold"
                                        // bg-gradient-to-b from-yellow-300 to-amber-400 bg-clip-text text-transparent
                                        // style={{ WebkitBackgroundClip: "text" }}
                                    >
                                        Unclutter
                                    </h1>
                                </div>

                                <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
                            </div>
                        </aside>
                        <div className="right-side m-4 h-full max-h-full w-full">
                            <div className="mx-auto max-w-5xl rounded-lg bg-white px-8 py-6 shadow-sm">
                                {currentTab === "list" && <RecentModalTab />}
                                {currentTab === "stats" && <StatsModalTab />}
                                {currentTab === "highlights" && <QuotesTab />}
                                {currentTab === "settings" && <SettingsModalTab />}
                            </div>
                        </div>
                    </div>
                </ModalStateContext.Provider>
            </FilterContext.Provider>
        </div>
    );
}