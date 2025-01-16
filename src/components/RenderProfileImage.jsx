import domainUrl from "../utils/domain";
import styles from "./RenderProfileImage.module.css"

function RenderProfileImage({ chat, authState, size }) {
  return chat && chat.profileImage ? (
    <div className={styles.profileImageContainer} style={{width:size + "px", height:size+"px"}}>
      <img
        src={domainUrl + "/" + chat.profileImage}
        className={styles.profileImageSingle}
        alt=""
        style={{width:size + "px", height:size + "px"}}
      />
    </div>
  ) : chat && (
    (() => {
     
      let memberIds = [];
      // Loop through messages in reverse order
      for (let i = chat.messages.length - 1; i >= 0; i--) {
        if (!memberIds.includes(chat.messages[i].userId)) {
          if (chat.messages[i].userId !== authState.user.id) {
            memberIds.push(chat.messages[i].userId);
          }
        }
        if (memberIds.length === 2) {
          break; // Stop once we have 2 unique members
        }
      }
      if (memberIds.length < 2) {
        chat.members.forEach((member) => {
          if (
            member.id !== authState.user.id &&
            !memberIds.includes(member.id) &&
            memberIds.length < 2
          ) {
            memberIds.push(member.id);
          }
        });
      }

      if (memberIds.length === 0 && chat.members.length === 1) {
        memberIds.push(chat.members[0].id);
      }

      // Use .find() to get the member data
      const selectedMembers = memberIds
        .map((memberId) =>
          chat.members.find((member) => member.id === memberId)
        )
        .filter((member) => member !== undefined);

      return (
        <div className={styles.profileImageContainer} style={{width:size + "px", height:size + "px"}}>
          {selectedMembers.map((member, index) => (
            <img
              key={member.id}
              className={` ${selectedMembers.length === 1 ? styles.profileImageSingle : styles["profileImage" + index]}`}
              style={{
                width: selectedMembers.length === 1 ? size + "px" : size * 0.7 + "px"  , // Conditional width
                height: selectedMembers.length === 1 ? size : size * 0.7 +"px", // Optional: match height with width
              }}
              src={
                member.profileImage
                  ? domainUrl + "/" + member.profileImage
                  : "/icons/profile.svg"
              }
              alt=""
            />
          ))}
        </div>
      );
    })()
  );
}

export default RenderProfileImage
