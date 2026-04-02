import React, { FC, useState } from "react";
import Icon from "../Icon";
import Sharebetmodal from "../modals/Sharebetmodal";
import Sharemarketmodal from "../modals/Sharemarketmodal";
type ModalKeys =
  | "createprofile"
  | "Shareresults"
  | "Claimprocessed"
  | "Claimsuccessfully"
  | "Sharemarket"
  | "Sharebet"
  | "withdraw"
  | "deposit";
type ModalState = Record<ModalKeys, boolean>;
const Sharemarket: FC = () => {
  const [modals, setModals] = useState<ModalState>({
    createprofile: false,
    Shareresults: false,
    Claimprocessed: false,
    Claimsuccessfully: false,
    Sharemarket: false,
    Sharebet: false,
    withdraw: false,
    deposit: false,
  });

  const openModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  const closeModal = (name: ModalKeys) => {
    setModals((prev) => ({ ...prev, [name]: false }));
  };
  return (
    <>
      <div className="sharemain">
             <p className="sharepara">SHARE</p>
             <div className="iconsmain">
               <span onClick={()=>{
                openModal('Sharemarket')
               }} className="innericon">
                 <Icon name="x" />
               </span>
               <span onClick={()=>{
                openModal('Sharemarket')
               }} className="innericon">
                 <Icon name="facebook" />
               </span>
               <span onClick={()=>{
                openModal('Sharemarket')
               }} className="innericon">
                 <Icon name="telegram" />
               </span>
               <span onClick={()=>{
                openModal('Sharemarket')
               }} className="innericon">
                 <Icon name="whatsapp" />
               </span>
               <span onClick={()=>{
                openModal('Sharemarket')
               }} className="innericon">
                 <Icon name="mail" />
               </span>
               <span onClick={()=>{
                openModal('Sharemarket')
               }} className="innericon">
                 <Icon name="link" />
               </span>
             </div>
           </div>
      <Sharemarketmodal
        show={modals.Sharemarket}
        onHide={() => closeModal("Sharemarket")}
      />
    </>
  );
};

export default Sharemarket;
