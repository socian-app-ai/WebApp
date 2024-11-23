import { Link } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useAuthContext } from "../../context/AuthContext";
import { useSetInfoBarState } from "../../state_management/zustand/useInfoBar";
import { useEffect } from "react";

function InfoBar() {
  const { infoBarState, setInfoBarState } = useSetInfoBarState();
  const { width } = useWindowDimensions();
  const { authUser } = useAuthContext();

  useEffect(() => {

    if (width < 1028) {
      setInfoBarState(false);
    }

    if (width > 1028) {
      setInfoBarState(true);
    }
    if (authUser?.super_role === 'super') setInfoBarState(false)
    // console.log("useEffect");
  }, [width, setInfoBarState]);

  if (authUser.role !== "student") return;

  return (
    <div
      className={`${infoBarState ? "right-0" : "-right-[100rem]"
        }  z-10 w-64 bg-sidebar-pattern bg-bg-var-sidebar dark:bg-bg-var-sidebar-dark dark:text-white h-screen p-4 fixed`}
    >
      <nav className="mt-14">
        <div>
          <h5 className="mb-1 font-bold">My Connection</h5>
          <div className="my-2">
            <div className="flex flex-row">
              <img src="" className="w-5 h-5 rounded-full mr-3" />
              <p>Bilal E.</p>
            </div>

            <div className="flex flex-row">
              <img src="" className="w-5 h-5 rounded-full mr-3" />
              <p>Bilal E.</p>
            </div>

            <div className="flex flex-row">
              <img src="" className="w-5 h-5 rounded-full mr-3" />
              <p>Bilal E.</p>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <button
              className="border rounded-md px-2 py-1"
              style={{ backgroundColor: "var(--var-btn-primary)" }}
            >
              <p style={{ color: "var(--var-text-primary)" }}>show more</p>
            </button>
          </div>
        </div>
        <div>
          <div className="py-2 px-1 m-1">
            {/* Current Gathering */}
            <h5 className="font-bold mb-1">Current Gathering</h5>
            {/* 1st */}
            <div className="border rounded-md mb-1">
              <h6 className="text-center font-bold text-lg">
                Dramatic Society
              </h6>
              <p className="text-center font-semibold text-xs">
                Invitation for rehearsal
              </p>

              <div className="flex flex-row p-2 justify-between">
                <div className="text-xs">
                  <p className="font-semibold">Outside N block</p>
                  <p>43 people gathering</p>
                </div>

                <button className="text-xs text-end hover:text-slate-800">
                  click for details
                </button>
              </div>
            </div>
            {/* 2nd */}
            <div className="border rounded-md mb-1">
              <h6 className="text-center font-bold text-lg">Other Society</h6>
              <p className="text-center font-semibold text-xs">
                Invitation for rehearsal
              </p>

              <div className="flex flex-row p-2 justify-between">
                <div className="text-xs">
                  <p className="font-semibold">Outside N block</p>
                  <p>43 people gathering</p>
                </div>

                <button className="text-xs text-end hover:text-slate-800">
                  click for details
                </button>
              </div>
            </div>
          </div>
          {/* Upcoming Gathering */}
          <div className="py-2 px-1 m-1">
            <h5 className="font-bold mb-1"> Upcoming Gathering</h5>
            <div className="border rounded-md mb-1">
              <h6 className="text-center font-bold text-lg">
                Dramatic Society
              </h6>
              <p className="text-center font-semibold text-xs">
                Invitation for rehearsal
              </p>

              <div className="flex flex-row p-2 justify-between">
                <div className="text-xs">
                  <p className="font-semibold">Outside N block</p>
                  <p>43 people gathering</p>
                </div>

                <button className="text-xs text-end hover:text-slate-800">
                  click for details
                </button>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <button
              className="border rounded-md px-2 py-1"
              style={{ backgroundColor: "var(--var-btn-primary)" }}
            >
              <p style={{ color: "var(--var-text-primary)" }}>see all</p>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
export default InfoBar;
