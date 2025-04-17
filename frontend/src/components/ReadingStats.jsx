// frontend/src/components/ReadingStats.jsx
import React from 'react';
import { Bar } from 'recharts';

const ReadingStats = ({ stats }) => {
  if (!stats) return <p>Loading stats...</p>;

  // Format monthly data for chart
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const chartData = Array(12)
    .fill()
    .map((_, i) => ({
      name: months[i],
      books: 0,
    }));

  // Fill in actual data
  stats.booksPerMonth?.forEach((item) => {
    if (item.month >= 1 && item.month <= 12) {
      chartData[item.month - 1].books = item.count;
    }
  });

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-bold'>Reading Stats</h3>

      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-gray-50 rounded-lg p-4 text-center'>
          <p className='text-3xl font-bold'>
            {stats.statusCounts?.completed || 0}
          </p>
          <p className='text-gray-500 text-sm'>Books Completed</p>
        </div>

        <div className='bg-gray-50 rounded-lg p-4 text-center'>
          <p className='text-3xl font-bold'>
            {stats.statusCounts?.reading || 0}
          </p>
          <p className='text-gray-500 text-sm'>Currently Reading</p>
        </div>

        <div className='bg-gray-50 rounded-lg p-4 text-center'>
          <p className='text-3xl font-bold'>
            {stats.statusCounts?.want_to_read || 0}
          </p>
          <p className='text-gray-500 text-sm'>Want to Read</p>
        </div>

        <div className='bg-gray-50 rounded-lg p-4 text-center'>
          <p className='text-3xl font-bold'>{stats.totalPagesRead || 0}</p>
          <p className='text-gray-500 text-sm'>Pages Read</p>
        </div>
      </div>

      <div className='mt-6'>
        <h4 className='text-md font-medium mb-3'>Books Completed This Year</h4>
        <div className='h-40 bg-gray-50 rounded-lg p-4'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData}>
              <XAxis dataKey='name' tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey='books' fill='#000' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReadingStats;
