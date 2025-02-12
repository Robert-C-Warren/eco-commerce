import React from "react";
import "./BScoreChart.css"
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

const BScoreChart = ({ score }) => {
    const maxScore = 250; // Full circle at 250
    const normalizedScore = (score / maxScore) * 100; // Convert to percentage

    const data = [
        { name: "B Score", value: 100, fill: "rgba(0, 136, 254, 0.2" }, // Scale the value
        { name: "B Score", value: normalizedScore, fill: "#0088FE" }, // Scale the value
    ];

    return (
        <div className="bar-container">
            <h4 className="impact">B Impact Score</h4>
            <ResponsiveContainer>
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={data} startAngle={270} endAngle={-90}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar dataKey="value" data={[data[0]]} cornerRadius={5} />
                    <RadialBar minAngle={15} clockWise dataKey="value" data={[data[1]]} cornerRadius={5} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="24px">
                        {score}
                    </text>
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BScoreChart;