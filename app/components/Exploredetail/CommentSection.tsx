import React, { useState, ChangeEvent } from "react";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

interface Reply {
  id: number;
  user: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

interface Comment {
  id: number;
  user: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  replies?: Reply[];
}

interface CommentItemProps {
  d: Comment | Reply;
  reply?: boolean;
}

interface AvatarProps {
  src: string;
  size?: number;
}

interface ThumbIconProps {
  active: boolean;
}

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const AVATARS: string[] = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=25",
  "https://i.pravatar.cc/150?img=32",
];

const COMMENTS: Comment[] = [
  {
    id: 1,
    user: "Kelly Snider",
    avatar: AVATARS[0],
    time: "5min ago",
    text: "Lorem ipsum dolor sit amet. Eum officia quia vel dolorem rerum a possimus possimus ab beatae accusantium id sint consequuntur hic reiciendis molestiae.",
    likes: 32,
    replies: [
      {
        id: 11,
        user: "Marcus Chen",
        avatar: AVATARS[1],
        time: "5min ago",
        text: "Est voluptatem labore aut ipsam aperiam ab obcaecati voluptas eos quia velit sit molestias voluptatem est galisum assumenda et quos consequuntur. Et deleniti labore est nihil sapiente sed inventore vitae et rerum repellat.",
        likes: 12,
      },
      {
        id: 12,
        user: "Sophia Reyes",
        avatar: AVATARS[2],
        time: "5min ago",
        text: "33 recusandae voluptas et impedit optio ut praesentium sint et obcaecati nemo ut autem sunt.",
        likes: 5,
      },
    ],
  },
  {
    id: 2,
    user: "James Hartwell",
    avatar: AVATARS[3],
    time: "5min ago",
    text: "Et voluptas quas sed suscipit modi ut aperiam saepe eos sint aliquid aut sint nostrum? A nesciunt recusandae et voluptatem nihil quo impedit dicta.",
    likes: 1,
    replies: [
      {
        id: 21,
        user: "Aria Nakamura",
        avatar: AVATARS[4],
        time: "5min ago",
        text: "Est voluptatem labore aut ipsam aperiam ab obcaecati voluptas eos quia velit sit molestias voluptatem est galisum assumenda et quos consequuntur. Et deleniti labore est nihil sapiente sed inventore vitae et rerum repellat.",
        likes: 15,
      },
      {
        id: 22,
        user: "Liam Foster",
        avatar: AVATARS[5],
        time: "5min ago",
        text: "Sit distinctio quis eum dolorum voluptas aut nesciunt fuga est dolores amet eos quibusdam itaque aut voluptates praesentium.",
        likes: 2,
      },
    ],
  },
  {
    id: 3,
    user: "Elena Vasquez",
    avatar: AVATARS[6],
    time: "5min ago",
    text: "Et minima consectetur rem provident modi id dolorem blanditiis.",
    likes: 0,
    replies: [],
  },
  {
    id: 4,
    user: "Daniel Kim",
    avatar: AVATARS[7],
    time: "5min ago",
    text: "Et dolorem ipsum est expedita voluptate sit quos necessitatibus hic minima rerum qui reiciendis internos et eaque porro aut harum animi.",
    likes: 9,
    replies: [],
  },
];

/* ═══════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════ */

const ThumbIcon: React.FC<ThumbIconProps> = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={active ? "#f97316" : "#64748b"}>
    <path d="M2 20h2V8H2v12zm20-12c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 0 6.59 6.59C6.22 6.95 6 7.45 6 8v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
  </svg>
);

const ReplyIcon: React.FC = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M18.1255 15.6253C18.1255 15.7911 18.0596 15.9501 17.9424 16.0673C17.8252 16.1845 17.6663 16.2504 17.5005 16.2504C17.3347 16.2504 17.1758 16.1845 17.0585 16.0673C16.9413 15.9501 16.8755 15.7911 16.8755 15.6253C16.8734 13.8026 16.1484 12.0551 14.8596 10.7663C13.5707 9.47741 11.8232 8.75242 10.0005 8.75035H4.00909L6.69268 11.4332C6.80995 11.5504 6.87584 11.7095 6.87584 11.8753C6.87584 12.0412 6.80995 12.2003 6.69268 12.3175C6.5754 12.4348 6.41634 12.5007 6.25049 12.5007C6.08464 12.5007 5.92558 12.4348 5.8083 12.3175L2.0583 8.56754C2.00019 8.50949 1.95409 8.44056 1.92264 8.36469C1.89119 8.28881 1.875 8.20748 1.875 8.12535C1.875 8.04321 1.89119 7.96188 1.92264 7.88601C1.95409 7.81014 2.00019 7.74121 2.0583 7.68316L5.8083 3.93316C5.92558 3.81588 6.08464 3.75 6.25049 3.75C6.41634 3.75 6.5754 3.81588 6.69268 3.93316C6.80995 4.05044 6.87584 4.2095 6.87584 4.37535C6.87584 4.5412 6.80995 4.70026 6.69268 4.81754L4.00909 7.50035H10.0005C12.1547 7.50262 14.22 8.35938 15.7432 9.88262C17.2665 11.4059 18.1232 13.4712 18.1255 15.6253Z" fill="#74728B"/>
</svg>
);

/* ═══════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════ */

const Avatar: React.FC<AvatarProps> = ({ src, size = 36 }) => (
  <img
    src={src}
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

const CommentItem: React.FC<CommentItemProps> = ({ d, reply = false }) => (
  <div
    style={{
      display: "flex",
      gap: 12,
      padding: "14px 16px",
      marginBottom: 2,
      marginLeft: reply ? 48 : 0,
    }}
    className={reply ? "cmt-reply" : ""}
  >
    <Avatar src={d.avatar} size={reply ? 30 : 36} />
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
        <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{d.user}</span>
        <span style={{ fontSize: 12, color: "#74728B" }}>{d.time}</span>
      </div>
      <p style={{ fontSize: 14, color: "#8899b0", lineHeight: 1.55, margin: 0, marginBottom: 8 }}>
        {d.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button className="cmt-like-btn">
          <ThumbIcon active={d.likes > 0} />
          <span>{d.likes}</span>
        </button>
        {!reply && (
          <button className="cmt-reply-btn">
            <ReplyIcon /> Reply
          </button>
        )}
      </div>
    </div>
  </div>
);

const CommentsList: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {COMMENTS.map((c) => (
      <div key={c.id} style={{ marginBottom: 2 }}>
        <CommentItem d={c} />
        {c.replies?.map((r) => (
          <CommentItem key={r.id} d={r} reply />
        ))}
      </div>
    ))}
  </div>
);

const DesktopCommentInput: React.FC = () => {
  const [t, setT] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setT(e.target.value);

  return (
    <div className="desktop-input-wrap">
      <Avatar src={AVATARS[8]} size={36} />
      <div className="desktop-input-box">
        <textarea
          placeholder="What do you think?"
          value={t}
          onChange={handleChange}
          maxLength={300}
        />
        <div className="desktop-input-foot">
          <span>{t.length}/300 Characters</span>
          <button className="desktop-input-post">Post</button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

const CommentSection: React.FC = () => {
  const [mobileInput, setMobileInput] = useState<string>("");

  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => setMobileInput(e.target.value);

  return (
    <div className="cs-root">
      <div className="cs-desktop">
        <div className="cs-card">
          <h3 className="cs-title">Comments (98)</h3>
          <DesktopCommentInput />
          <div className="cs-comments-scroll">
            <CommentsList />
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
          />
          <button className="mob-cmt-bar-emoji">😊</button>
          <button className="mob-cmt-bar-send">Send</button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;