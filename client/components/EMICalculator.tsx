"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

interface EMICalculatorProps {
  propertyPrice: number;
}

export default function EMICalculator({ propertyPrice }: EMICalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(Math.round(propertyPrice * 0.8));
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;

    if (monthlyRate === 0) {
      const emi = principal / months;
      return { emi, totalInterest: 0, totalAmount: principal };
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    return { emi, totalInterest, totalAmount };
  }, [loanAmount, interestRate, tenure]);

  const principalPercent = (loanAmount / totalAmount) * 100;

  function formatINR(num: number): string {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    return num.toLocaleString("en-IN");
  }

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="h-5 w-5 text-blue-400" />
        <h3 className="text-white font-semibold">EMI Calculator</h3>
      </div>

      <div className="space-y-5">
        {/* Loan Amount */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Loan Amount</span>
            <span className="text-white font-medium">
              ₹{formatINR(loanAmount)}
            </span>
          </div>
          <input
            type="range"
            min={100000}
            max={propertyPrice}
            step={100000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1">
            <span>₹1 L</span>
            <span>₹{formatINR(propertyPrice)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Interest Rate</span>
            <span className="text-white font-medium">{interestRate}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={15}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1">
            <span>5%</span>
            <span>15%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Loan Tenure</span>
            <span className="text-white font-medium">{tenure} years</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1">
            <span>1 yr</span>
            <span>30 yrs</span>
          </div>
        </div>

        {/* Results */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="text-center">
            <p className="text-gray-500 text-xs mb-1">Monthly EMI</p>
            <p className="text-2xl font-bold text-blue-400">
              ₹{Math.round(emi).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Principal vs Interest bar */}
          <div className="h-3 rounded-full overflow-hidden flex bg-white/5">
            <div
              className="bg-blue-500 rounded-l-full"
              style={{ width: `${principalPercent}%` }}
            />
            <div
              className="bg-amber-500 rounded-r-full"
              style={{ width: `${100 - principalPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-gray-500">Principal</span>
              </div>
              <p className="text-white text-sm font-medium">
                ₹{formatINR(loanAmount)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[10px] text-gray-500">Interest</span>
              </div>
              <p className="text-white text-sm font-medium">
                ₹{formatINR(Math.round(totalInterest))}
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-[10px] text-gray-500 mb-1">Total Amount</p>
            <p className="text-white font-semibold">
              ₹{formatINR(Math.round(totalAmount))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
