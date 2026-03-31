"use client";
import React, { FC } from "react";
import Icon from "../Icon";
import { usePositions } from "./PositionsContext";

const MainPositions: FC = () => {
  const { isOpen, close, toggle } = usePositions();

  return (
    <aside className={`mainpositions ${isOpen ? "show" : "hide"}`}>

      <button className="positions-handle" onClick={toggle}>
        <span className="mainnumber">13</span>
        <p className="openpara">My Positions</p>
        <Icon name="openarrow" className={isOpen ? "rotate" : ""} />
      </button>

      <div className="positionheader">
        <div className="headerleft">
          <h3 className="mainheading">Open Positions (13)</h3>
          <p className="realpara">Real-time P&L tracking</p>
        </div>
        <button onClick={close} className="positionbtn">
          <Icon name="crossicon" />
        </button>
      </div>

      <div className="totalmain">
        <h6 className="totallefthead">Total P&L</h6>
        <div className="totalright">
          <h6 className="totalhead greencolor">+$23.90</h6>
          <p className="totalpara greencolor">+9.56%</p>
        </div>
      </div>

      <div className="historytable">
        <table>
          <thead>
            <tr>
              <th>Pair</th>
              <th>Time</th>
              <th>Amount</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            <tr className="green">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="up" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">+$8.50</h6>
                  <p className="plpara">+17.0%</p>
                </div>
              </td>
            </tr>
            <tr className="red">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="down" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">-$8.50</h6>
                  <p className="plpara">-17.0%</p>
                </div>
              </td>
            </tr>
                 <tr className="green">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="up" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">+$8.50</h6>
                  <p className="plpara">+17.0%</p>
                </div>
              </td>
            </tr>
            <tr className="red">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="down" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">-$8.50</h6>
                  <p className="plpara">-17.0%</p>
                </div>
              </td>
            </tr>
                 <tr className="green">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="up" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">+$8.50</h6>
                  <p className="plpara">+17.0%</p>
                </div>
              </td>
            </tr>
            <tr className="red">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="down" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">-$8.50</h6>
                  <p className="plpara">-17.0%</p>
                </div>
              </td>
            </tr>
                 <tr className="green">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="up" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">+$8.50</h6>
                  <p className="plpara">+17.0%</p>
                </div>
              </td>
            </tr>
            <tr className="red">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="down" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">-$8.50</h6>
                  <p className="plpara">-17.0%</p>
                </div>
              </td>
            </tr>
                 <tr className="green">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="up" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">+$8.50</h6>
                  <p className="plpara">+17.0%</p>
                </div>
              </td>
            </tr>
            <tr className="red">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="down" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">-$8.50</h6>
                  <p className="plpara">-17.0%</p>
                </div>
              </td>
            </tr>
                 <tr className="green">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="up" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">+$8.50</h6>
                  <p className="plpara">+17.0%</p>
                </div>
              </td>
            </tr>
            <tr className="red">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="down" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">-$8.50</h6>
                  <p className="plpara">-17.0%</p>
                </div>
              </td>
            </tr>
                 <tr className="green">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="up" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">+$8.50</h6>
                  <p className="plpara">+17.0%</p>
                </div>
              </td>
            </tr>
            <tr className="red">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="down" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">-$8.50</h6>
                  <p className="plpara">-17.0%</p>
                </div>
              </td>
            </tr>
                 <tr className="green">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="up" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">+$8.50</h6>
                  <p className="plpara">+17.0%</p>
                </div>
              </td>
            </tr>
            <tr className="red">
              <td>
                <div className="maintoken">
                  <span className="tokenimg"><Icon name="down" /></span>
                  <p className="tokenpara">BTC/USDT</p>
                </div>
              </td>
              <td>
                <div className="maintimer">
                  <Icon name="timeicon" />
                  <p className="timepara">0:10</p>
                </div>
              </td>
              <td><p className="amountpara">$112</p></td>
              <td>
                <div className="plmain">
                  <h6 className="plhead">-$8.50</h6>
                  <p className="plpara">-17.0%</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="positionfooter">
        <p className="footerpara">Positions update in real-time</p>
      </div>
    </aside>
  );
};

export default MainPositions;