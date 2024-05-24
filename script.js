document.addEventListener("DOMContentLoaded", function() {
    fetch('salaries.csv')
        .then(response => response.text())
        .then(data => {
            processData(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function processData(data) {
    const rows = data.split('\n').slice(1); // Skip header row
    const tableBody = document.getElementById('table-body');
    const secondaryTableBody = document.getElementById('secondary-table-body');

    // Variables for line chart
    const years = [];
    const totalJobs = Array(5).fill(0); // Initialize an array to store the total number of jobs for each year

    rows.forEach(row => {
        const columns = row.split(',');
        const workYear = parseInt(columns[0]);
        const jobTitle = columns[3];

        // Add data to main table
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${workYear}</td>
            <td>${columns[1]}</td>
            <td>${columns[2]}</td>
            <td>${jobTitle}</td>
            <td>${columns[4]}</td>
            <td>${columns[5]}</td>
            <td>${columns[6]}</td>
            <td>${columns[7]}</td>
            <td>${columns[8]}</td>
            <td>${columns[9]}</td>
        `;
        tableBody.appendChild(newRow);

        // Increment the total number of jobs for the corresponding year
        totalJobs[workYear - 2020]++;

        // Add event listener to show aggregated job titles on row click
        newRow.addEventListener('click', function() {
            showAggregatedJobTitles(workYear, jobTitle);
        });
    });

    // Draw line chart
    drawLineChart(totalJobs);
}

function drawLineChart(totalJobs) {
    const years = [2020, 2021, 2022, 2023, 2024];
    const ctx = document.getElementById('line-chart').getContext('2d');
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Total Jobs',
                data: totalJobs,
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
                pointRadius: 5, // Size of the points
                pointBackgroundColor: 'blue', // Color of the points
                pointBorderColor: 'blue', // Border color of the points
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showAggregatedJobTitles(workYear, selectedJobTitle) {
    const secondaryTableBody = document.getElementById('secondary-table-body');
    secondaryTableBody.innerHTML = ''; // Clear previous data

    const rows = document.querySelectorAll("#table-body tr");
    const jobTitles = {};

    rows.forEach(row => {
        const columns = row.querySelectorAll("td");
        const year = parseInt(columns[0].textContent);
        const jobTitle = columns[3].textContent;

        if (year === workYear) {
            jobTitles[jobTitle] = (jobTitles[jobTitle] || 0) + 1;
        }
    });

    for (const [title, count] of Object.entries(jobTitles)) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${title}</td>
            <td>${count}</td>
        `;
        secondaryTableBody.appendChild(newRow);
    }
}
