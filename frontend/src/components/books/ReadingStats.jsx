// src/components/books/ReadingStats.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ReadingStats = ({ stats }) => {
  const { statusCounts, totalPagesRead, booksPerMonth } = stats;

  // Format month data for chart
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Fill in missing months with zero counts
  const chartData = Array(12)
    .fill()
    .map((_, index) => {
      const monthNumber = index + 1;
      const foundMonth = booksPerMonth.find(
        (item) => item.month === monthNumber
      );

      return {
        name: monthNames[index],
        count: foundMonth ? foundMonth.count : 0,
      };
    });

  const totalBooks = Object.values(statusCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  // Format status labels
  const formatStatus = (status) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-bold mb-6'>My Reading Stats</h2>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* Total Books */}
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='text-sm font-medium text-blue-700'>Total Books</h3>
          <p className='text-3xl font-bold text-blue-800 mt-1'>{totalBooks}</p>
        </div>

        {/* Total Pages Read */}
        <div className='bg-green-50 p-4 rounded-lg'>
          <h3 className='text-sm font-medium text-green-700'>Pages Read</h3>
          <p className='text-3xl font-bold text-green-800 mt-1'>
            {totalPagesRead}
          </p>
        </div>

        {/* Currently Reading */}
        <div className='bg-yellow-50 p-4 rounded-lg'>
          <h3 className='text-sm font-medium text-yellow-700'>
            Currently Reading
          </h3>
          <p className='text-3xl font-bold text-yellow-800 mt-1'>
            {statusCounts.reading || 0}
          </p>
        </div>

        {/* Completed Books */}
        <div className='bg-purple-50 p-4 rounded-lg'>
          <h3 className='text-sm font-medium text-purple-700'>Completed</h3>
          <p className='text-3xl font-bold text-purple-800 mt-1'>
            {statusCounts.completed || 0}
          </p>
        </div>
      </div>

      {/* Books by Status */}
      <div className='mt-8'>
        <h3 className='text-lg font-medium mb-4'>Books by Status</h3>
        <div className='flex flex-wrap gap-3'>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div>
                  <span className='text-xs font-semibold inline-block text-gray-600'>
                    {formatStatus(status)}
                  </span>
                </div>
                <div className='text-right'>
                  <span className='text-xs font-semibold inline-block text-gray-600'>
                    {count} ({Math.round((count / totalBooks) * 100)}%)
                  </span>
                </div>
              </div>
              <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 mt-1 w-48'>
                <div
                  style={{ width: `${(count / totalBooks) * 100}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    status === 'reading'
                      ? 'bg-yellow-500'
                      : status === 'completed'
                      ? 'bg-purple-500'
                      : status === 'want_to_read'
                      ? 'bg-blue-500'
                      : 'bg-gray-500'
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Books Completed Per Month Chart */}
      {booksPerMonth.length > 0 && (
        <div className='mt-8'>
          <h3 className='text-lg font-medium mb-4'>
            Books Completed This Year
          </h3>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  angle={-45}
                  textAnchor='end'
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [`${value} books`, 'Completed']}
                />
                <Bar dataKey='count' fill='#8884d8' name='Books Completed' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

ReadingStats.propTypes = {
  stats: PropTypes.shape({
    statusCounts: PropTypes.shape({
      want_to_read: PropTypes.number,
      reading: PropTypes.number,
      completed: PropTypes.number,
      did_not_finish: PropTypes.number,
    }).isRequired,
    totalPagesRead: PropTypes.number.isRequired,
    booksPerMonth: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ReadingStats;
