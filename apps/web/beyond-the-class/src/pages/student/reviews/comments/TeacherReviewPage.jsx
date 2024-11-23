import { useEffect } from "react";
import { useSetInfoBarState } from "../../../../state_management/zustand/useInfoBar";
import CommentBox from "./box/CommentBox";
import Reviews from "./reviews/Comments";
import TeacherInfoCard from "./TeacherInfoCard";

const TeacherReviewPage = () => {
  const { infoBarState, setInfoBarState } = useSetInfoBarState();

  useEffect(() => {
    if (infoBarState === true) {
      setInfoBarState(false);
    }
  }, [setInfoBarState, infoBarState]);

  return (
    <div className="max-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          <div className="w-full">
            <CommentBox />
          </div>
          <div className="w-full ">
            <h6 className="p-5 text-xl font-semibold">Reviews</h6>
            <div className="overflow-x-scroll max-h-[80rem] h-auto">
              <Reviews />
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-0 px-2 order-1 lg:order-2">
          <TeacherInfoCard />
        </div>
      </div>
    </div>
  );
};

export default TeacherReviewPage;
