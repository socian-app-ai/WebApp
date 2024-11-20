import React from "react";
import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { BiSolidDownvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { FaRegMessage } from "react-icons/fa6";

export default function PostComponent() {
  const [type, setType] = useState("image");
  const [clamp, setClamp] = useState(true);

  const handleImageError = (event) => {
    event.target.src = "https://placehold.co/400x300";
  };

  return (
    <div className="my-4 bg-bg-primary-color dark:bg-bg-primary-color-dark border border-gray-200 dark:border-gray-800 rounded-sm shadow-md min-w-[10rem] max-w-[30rem] w-full min-h-[15rem] max-h-[35rem] h-full">
      {/* Header */}
      <div className="flex flex-row justify-between p-2 ">
        <div className="flex flex-row ">
          <div>
            <img
              src="/static/logo.png"
              alt="Avatar"
              className="h-8 w-8 rounded-full border-2 border-white object-cover"
              onError={handleImageError}
            />
          </div>
          <div className="flex flex-col ml-2 -space-y-1">
            <div className="flex flex-row items-center ">
              <p className="text-md font-semibold text-text-primary dark:text-text-primary-dark">
                Name
              </p>
              <p className="text-sm text-text-primary dark:text-text-primary-dark ml-1">
                @username
              </p>
            </div>
            <p className="text-xs text-text-primary dark:text-text-primary-dark">
              CS
            </p>
          </div>
          <p className="mt-1 ml-3 text-xs text-text-primary dark:text-text-primary-dark">
            2hrs ago
          </p>
        </div>

        <div>
          <BiDotsVerticalRounded />
        </div>
      </div>

      <div className="p-2">
        <h6 className="text-md font-bold ">Title</h6>
        <p
          className={`text-sm ${
            type === "image" && clamp ? "line-clamp-2" : "line-clamp-[10]"
          }`}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam dicta
          inventore tempora aliquid exercitationem molestias molestiae
          doloremque atque facilis? Recusandae temporibus facilis velit, quis
          eos doloremque eligendi nemo mollitia cum.
          {console.log("clamp", clamp)}
          {clamp && (
            <button
              className="text-xs text-white"
              onClick={() => setClamp(!clamp)}
            >
              see more
            </button>
          )}
        </p>
      </div>

      {/* Image */}
      <div
        className="p-2 "
        style={{ background: "url(/static/images/cards/yosemite.jpeg) blur" }}
      >
        <img
          src="/static/images/cards/yosemite.jpeg"
          alt="Post"
          className="w-full h-56 object-cover rounded-md border"
          onError={handleImageError}
        />
      </div>

      {/* Actions */}

      {/* Likes and Caption */}

      {/* Comment Input */}
      <div className="flex flex-row px-2 py-1 space-x-1 items-center">
        <VoteComponent isUpvote={false} isDownVote={true} />
        <CommentButton comment={{ length: 2 }} />
      </div>
    </div>
  );
}

export function VoteComponent({ isUpvote, isDownVote }) {
  const [isUpVoted, setIsUpVoted] = useState(isUpvote || false);
  const [isDownVoted, setIsDownVoted] = useState(isDownVote || false);

  const handleVote = () => {
    setIsUpVoted(!isUpVoted);
    setIsDownVoted(!isDownVoted);
  };
  return (
    <div className="flex flex-row items-center">
      {isUpVoted ? (
        <BiUpvote size={20} onClick={() => handleVote()} />
      ) : (
        <BiSolidUpvote size={20} onClick={() => handleVote()} />
      )}

      {isDownVoted ? (
        <BiDownvote size={20} onClick={() => handleVote()} />
      ) : (
        <BiSolidDownvote size={20} onClick={() => handleVote()} />
      )}
    </div>
  );
}

export function CommentButton(comment) {
  return (
    <button className="flex flex-row space-x-1 items-center" onClick={() => {}}>
      <FaRegMessage size={18} />
      <p>{comment?.length || 0}</p>
    </button>
  );
}
