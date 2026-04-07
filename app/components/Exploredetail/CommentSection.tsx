import React, { useState, useEffect, ChangeEvent } from "react";
import { postComments, getComments, likeComments } from "@/app/services/comments";
import { toast } from "react-toastify";

interface CommentUser {
  _id: string;
  displayName?: string;
  internalWalletAddress?: string;
  profileImage?: string;
}

interface CommentData {
  _id: string;
  user: CommentUser | string;
  avatar?: string;
  content: string;
  likes?: number;
  createdAt: string;
  replyCount?: number;
}

function getUserName(user: CommentUser | string): string {
  if (typeof user === "string") return user;
  return user.displayName || user.internalWalletAddress?.slice(0, 6) + "..." + user.internalWalletAddress?.slice(-4) || "Anonymous";
}

interface AvatarProps {
  src: string;
  size?: number;
}

interface ThumbIconProps {
  active: boolean;
}

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=32";
const COMMENTS_LIMIT = 10;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ThumbIcon: React.FC<ThumbIconProps> = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={active ? "#f97316" : "#64748b"}>
    <path d="M2 20h2V8H2v12zm20-12c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 0 6.59 6.59C6.22 6.95 6 7.45 6 8v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
  </svg>
);

const ReplyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M18.1255 15.6253C18.1255 15.7911 18.0596 15.9501 17.9424 16.0673C17.8252 16.1845 17.6663 16.2504 17.5005 16.2504C17.3347 16.2504 17.1758 16.1845 17.0585 16.0673C16.9413 15.9501 16.8755 15.7911 16.8755 15.6253C16.8734 13.8026 16.1484 12.0551 14.8596 10.7663C13.5707 9.47741 11.8232 8.75242 10.0005 8.75035H4.00909L6.69268 11.4332C6.80995 11.5504 6.87584 11.7095 6.87584 11.8753C6.87584 12.0412 6.80995 12.2003 6.69268 12.3175C6.5754 12.4348 6.41634 12.5007 6.25049 12.5007C6.08464 12.5007 5.92558 12.4348 5.8083 12.3175L2.0583 8.56754C2.00019 8.50949 1.95409 8.44056 1.92264 8.36469C1.89119 8.28881 1.875 8.20748 1.875 8.12535C1.875 8.04321 1.89119 7.96188 1.92264 7.88601C1.95409 7.81014 2.00019 7.74121 2.0583 7.68316L5.8083 3.93316C5.92558 3.81588 6.08464 3.75 6.25049 3.75C6.41634 3.75 6.5754 3.81588 6.69268 3.93316C6.80995 4.05044 6.87584 4.2095 6.87584 4.37535C6.87584 4.5412 6.80995 4.70026 6.69268 4.81754L4.00909 7.50035H10.0005C12.1547 7.50262 14.22 8.35938 15.7432 9.88262C17.2665 11.4059 18.1232 13.4712 18.1255 15.6253Z" fill="#74728B" />
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#74728B">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
);

const Avatar: React.FC<AvatarProps> = ({ src, size = 36 }) => (
  <img
    src={src || DEFAULT_AVATAR}
    alt=""
    style={{
      width: size,
      height: size,
      minWidth: size,
      borderRadius: "50%",
      flexShrink: 0,
      objectFit: "cover",
    }}
  />
);

// --- Inline Reply Input ---
const InlineReplyInput: React.FC<{
  coinId: string;
  replyTo: string;
  onPosted: () => void;
  onCancel: () => void;
}> = ({ coinId, replyTo, onPosted, onCancel }) => {
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async () => {
    const content = text.trim();
    if (!content) return;

    setIsPosting(true);
    try {
      const result = await postComments({ coinId, content, replyTo });
      if (result) {
        setText("");
        onPosted();
      } else {
        toast.error("Failed to post reply");
      }
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, padding: "8px 16px", marginLeft: 48 }}>
      <Avatar src={DEFAULT_AVATAR} size={28} />
      <div style={{ flex: 1, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Write a reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isPosting}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "6px 12px",
            color: "#fff",
            fontSize: 13,
            outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isPosting && text.trim()) handleSubmit();
          }}
        />
        <button
          className="desktop-input-post"
          onClick={handleSubmit}
          disabled={isPosting || !text.trim()}
          style={{ fontSize: 12, padding: "4px 12px" }}
        >
          {isPosting ? "..." : "Reply"}
        </button>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: "#74728B",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// --- Single Comment Item ---
const CommentItem: React.FC<{
  comment: CommentData;
  isReply?: boolean;
  coinId: string;
  onRefresh: () => void;
}> = ({ comment, isReply = false, coinId, onRefresh }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes ?? 0);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentData[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [repliesCursor, setRepliesCursor] = useState<string | undefined>();
  const [replyTotalCount, setReplyTotalCount] = useState<number>(comment.replyCount ?? 0);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const fetchReplies = async (cursor?: string) => {
    setRepliesLoading(true);
    try {
      const result = await getComments({
        coinId,
        limit: COMMENTS_LIMIT,
        replyTo: comment._id,
        nextCursor: cursor,
      });
      if (result) {
        const newReplies = result.comments ?? result.data ?? result;
        if (cursor) {
          setReplies((prev) => [...prev, ...(Array.isArray(newReplies) ? newReplies : [])]);
        } else {
          setReplies(Array.isArray(newReplies) ? newReplies : []);
        }
        setRepliesCursor(result.nextCursor || undefined);
        if (result.totalCount !== undefined) setReplyTotalCount(result.totalCount);
      }
    } catch {
      toast.error("Failed to load replies");
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleToggleReplies = () => {
    if (!showReplies) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplyPosted = () => {
    setShowReplyInput(false);
    setShowReplies(true);
    fetchReplies();
  };

  return (
    <div style={{ marginBottom: 2 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "14px 16px",
          marginBottom: 2,
          marginLeft: isReply ? 48 : 0,
        }}
        className={isReply ? "cmt-reply" : ""}
      >
        <Avatar src={(typeof comment.user === "object" && comment.user?.profileImage) || DEFAULT_AVATAR} size={isReply ? 30 : 36} />
        <div
          style={{
            flex: 1,
            minWidth: 0,
            borderRadius: 14,
            background: "rgba(255, 255, 255, 0.02)",
            padding: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
              {getUserName(comment.user)}
            </span>
            <span style={{ fontSize: 12, color: "#74728B" }}>
              {comment.createdAt ? timeAgo(comment.createdAt) : ""}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "#8899b0", lineHeight: 1.55, margin: 0, marginBottom: 8 }}>
            {comment.content}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button className="cmt-like-btn">
              <ThumbIcon active={(comment.likes ?? 0) > 0} />
              <span>{comment.likes ?? 0}</span>
            </button>
            {!isReply && (
              <>
                <button className="cmt-reply-btn" onClick={() => setShowReplyInput(!showReplyInput)}>
                  <ReplyIcon /> Reply
                </button>
                <button
                  className="cmt-reply-btn"
                  onClick={handleToggleReplies}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <ChevronDownIcon />
                  {showReplies
                    ? "Hide replies"
                    : replyTotalCount > 0
                      ? `View replies (${replyTotalCount})`
                      : "View replies"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Inline reply input */}
      {showReplyInput && !isReply && (
        <InlineReplyInput
          coinId={coinId}
          replyTo={comment._id}
          onPosted={handleReplyPosted}
          onCancel={() => setShowReplyInput(false)}
        />
      )}

      {/* Replies list */}
      {showReplies && !isReply && (
        <div>
          {replies.map((r) => (
            <CommentItem
              key={r._id}
              comment={r}
              isReply
              coinId={coinId}
              onRefresh={onRefresh}
            />
          ))}
          {repliesLoading && (
            <p style={{ color: "#74728B", fontSize: 12, marginLeft: 64, padding: "4px 0" }}>
              Loading replies...
            </p>
          )}
          {!repliesLoading && repliesCursor && (
            <button
              className="cmt-reply-btn"
              style={{ marginLeft: 64, padding: "4px 0", fontSize: 12 }}
              onClick={() => fetchReplies(repliesCursor)}
            >
              Load more replies
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// --- Desktop Comment Input ---
const DesktopCommentInput: React.FC<{
  coinId: string;
  onCommentPosted: () => void;
}> = ({ coinId, onCommentPosted }) => {
  const [t, setT] = useState<string>("");
  const [isPosting, setIsPosting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setT(e.target.value);

  const handlePost = async () => {
    const content = t.trim();
    if (!content) return;
    if (!coinId) {
      toast.error("Coin info not available");
      return;
    }

    setIsPosting(true);
    try {
      const result = await postComments({ coinId, content });
      if (result) {
        setT("");
        onCommentPosted();
      } else {
        toast.error("Failed to post comment");
      }
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="desktop-input-wrap">
      <Avatar src={DEFAULT_AVATAR} size={36} />
      <div className="desktop-input-box">
        <textarea
          placeholder="What do you think?"
          value={t}
          onChange={handleChange}
          maxLength={300}
          disabled={isPosting}
        />
        <div className="desktop-input-foot">
          <span>{t.length}/300 Characters</span>
          <button className="desktop-input-post" onClick={handlePost} disabled={isPosting || !t.trim()}>
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main CommentSection ---
interface CommentSectionProps {
  coinId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ coinId }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [totalCount, setTotalCount] = useState(0);

  const [mobileInput, setMobileInput] = useState<string>("");
  const [isMobilePosting, setIsMobilePosting] = useState(false);

  const fetchComments = async (cursor?: string) => {
    if (!coinId) return;
    setLoading(true);
    try {
      const result = await getComments({
        coinId,
        limit: COMMENTS_LIMIT,
        nextCursor: cursor,
      });
      if (result) {
        const newComments = result.comments ?? result.data ?? result;
        if (cursor) {
          setComments((prev) => [...prev, ...(Array.isArray(newComments) ? newComments : [])]);
        } else {
          setComments(Array.isArray(newComments) ? newComments : []);
        }
        setNextCursor(result.nextCursor || undefined);
        if (result.totalCount !== undefined) setTotalCount(result.totalCount);
      }
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coinId) fetchComments();
  }, [coinId]);

  const handleCommentPosted = () => {
    fetchComments();
  };

  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => setMobileInput(e.target.value);

  const handleMobileSend = async () => {
    const content = mobileInput.trim();
    if (!content || !coinId) return;

    setIsMobilePosting(true);
    try {
      const result = await postComments({ coinId, content });
      if (result) {
        setMobileInput("");
        fetchComments();
      } else {
        toast.error("Failed to post comment");
      }
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsMobilePosting(false);
    }
  };

  return (
    <div className="cs-root">
      <div className="cs-desktop">
        <div className="cs-card">
          <h3 className="cs-title">Comments ({totalCount || comments.length})</h3>
          <DesktopCommentInput coinId={coinId} onCommentPosted={handleCommentPosted} />
          <div className="cs-comments-scroll">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {comments.map((c) => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  coinId={coinId}
                  onRefresh={handleCommentPosted}
                />
              ))}
              {loading && (
                <p style={{ color: "#74728B", fontSize: 13, textAlign: "center", padding: 16 }}>
                  Loading comments...
                </p>
              )}
              {!loading && comments.length === 0 && (
                <p style={{ color: "#74728B", fontSize: 13, textAlign: "center", padding: 16 }}>
                  No comments yet. Be the first!
                </p>
              )}
              {!loading && nextCursor && (
                <button
                  className="cmt-reply-btn"
                  style={{ textAlign: "center", padding: "8px 0", fontSize: 13 }}
                  onClick={() => fetchComments(nextCursor)}
                >
                  Load more comments
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed comment bar */}
      <div className="mob-cmt-bar-wrap">
        <div className="mob-cmt-bar">
          <input
            type="text"
            placeholder="What do you think?"
            value={mobileInput}
            onChange={handleMobileChange}
            disabled={isMobilePosting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isMobilePosting && mobileInput.trim()) handleMobileSend();
            }}
          />
          <button className="mob-cmt-bar-send" onClick={handleMobileSend} disabled={isMobilePosting || !mobileInput.trim()}>
            {isMobilePosting ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
