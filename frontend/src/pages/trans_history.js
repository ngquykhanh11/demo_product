import React, { useEffect, useRef, useState } from "react";
import { MainNav } from "../components/nav";
import * as d3 from "d3";
import "../styles/trans_history.css";

const TransactionHistory = () => {
  const [history, setHistory] = useState([]);
  const chartRef = useRef(null);

  
  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem("transactionHistory") || "[]");
    setHistory(loaded);
  }, []);

  // draw the chart when history is loaded
  useEffect(() => {
    if (history.length === 0) return;
    d3.select(chartRef.current).selectAll("*").remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // this calculates the amounts based on the history
    const amounts = history.map(tran => {
      const match = tran.deducted.match(/- ([\d.]+)/);
      const amount = match ? parseFloat(match[1]) : 0;
      const qty = tran.quantity ? parseInt(tran.quantity) : 1;
      return amount * qty;
    });

    const x = d3.scaleLinear()
      .domain([0, history.length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(amounts) || 100])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y((d) => y(d));

    svg.append("path")
      .datum(amounts)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(amounts.length));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [history]);

  // calculate total spent w the quantity included
  const total = history.reduce((sum, tran) => {
    const match = tran.deducted.match(/- ([\d.]+)/);
    const amount = match ? parseFloat(match[1]) : 0;
    const qty = tran.quantity ? parseInt(tran.quantity) : 1;
    return sum + (amount * qty);
  }, 0);

  
  const currency = history.length > 0 ? (history[0].currency || "") : "";

  return (
    <div>
      <MainNav />

      <div id="transaction-history" className="main-content">
        <h1 style={{
          fontFamily: '"Abril Fatface", sans-serif',
          fontSize: "2.5em",
          textAlign: "center",
          color: "#044b4d",
          backgroundColor: "#f8f4eb",
          padding: "15px 40px",
          borderRadius: "50px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          margin: "30px auto",
          marginTop: "110px"
        }}>YOUR TRANSACTION HISTORY</h1>
        <p>View your recent spendings:</p>
        <div id="chart-container">
          <div ref={chartRef}></div>
        </div>
        <h2 style={{ textAlign: "center", color: "#044b4d" }}>
          Total spent: {total} {currency}
        </h2>
      </div>

      <div id="transaction-history-info">
        <h2>Transaction History</h2>
        <p>This is a simple line chart showing your recent transactions. The X-axis represents the transaction number, and the Y-axis represents the amount spent in each transaction (including quantity).</p>
      </div>

      <div id="transaction-history-list">
        <h2>Recent Transactions</h2>
        <p>Your past transaction is here</p>
        <br />
        <div className="transaction-container">
          {history.length === 0 ? (
            <div style={{ color: "#888", margin: "16px 0" }}>No transaction found.</div>
          ) : (
            history.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <img src={transaction.img} alt={transaction.name} className="transaction-img" />
                <div>
                  <h4>{transaction.name}</h4>
                  <p>{transaction.deducted} x {transaction.quantity} = <b>{parseFloat(transaction.deducted.match(/- ([\d.]+)/)?.[1] || 0) * (parseInt(transaction.quantity) || 1)} {transaction.currency || ""}</b></p>
                  <p>Status: {transaction.status}</p>
                  <p style={{ fontSize: "0.95em", color: "#888" }}>
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { TransactionHistory };
