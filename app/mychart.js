//  Bar chart
const ctx = document.getElementById('myBarChart').getContext('2d');

 const phaseBarChart =  new Chart(ctx, {
    type: 'bar',
    data: {
    labels: ['a','b','c','d'],
    datasets: [{
            label: 'Tasks',
            data:  [0, 0, 0, 0],
            backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: 'rgba(0,0,0,0.1)',
            borderWidth: 1
        }]
        },
        options: {
        responsive: true,
        scales: {
            y: {
              beginAtZero: true
            }
        }
        }
    });



// Donnut Pie chart
const ctx2 = document.getElementById('myDoughnutChart').getContext('2d');

const myDoughnutChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
    labels: ['Not Started', 'In Progress', 'Completed', 'Approved'],
    datasets: [{
        label: 'Tasks',
        data: [0, 0, 0, 0],
        backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(99, 255, 195, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        
        
        ],
        borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(99, 255, 154, 1)',
        'rgba(54, 162, 235, 1)',
        
        
        ],
        borderWidth: 1
    }]
    },
    options: {
    responsive: true,
    plugins: {
        legend: {
        position: 'bottom'
        },
        tooltip: {
        enabled: true
        }
    }
    }
});

//////////////

const ctx3 = document.getElementById('budgetvsactual').getContext('2d');
const budgetvsactual = new Chart(ctx3, {
  type: 'bar',
  data: {
    labels: ['Project'],
    datasets: [
      {
        label: 'Budget',
        data: [50000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      },
      {
        label: 'Actual',
        data: [42000],
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


const allovsworked = document.getElementById("allovsworked").getContext('2d');

const allovsworkedChart = new Chart(allovsworked, {
  type: 'bar',
  data: {
    labels: ['Project'],
    datasets: [
      {
        label: 'Allocated',
        data: [0],
        backgroundColor: 'rgba(54, 96, 235, 0.6)'
      },
      {
        label: 'Worked',
        data: [0],
        backgroundColor: 'rgba(14, 220, 148, 0.85)'
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});