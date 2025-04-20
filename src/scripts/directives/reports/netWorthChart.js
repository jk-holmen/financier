import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  Interaction,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

angular
  .module("financier")
  .directive("netWorthChart", ($filter, netWorth, $translate) => {
    const intCurrency = $filter("intCurrency");

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return {
      restrict: "E",
      template: "<canvas></canvas>",
      scope: {
        transactions: "=",
      },
      replace: true,
      link: (scope, element) => {
        scope.$watch("transactions", (transactions) => {
          if (transactions) {
            generateReport();
          }
        });

        function getCurrencyValue(intVal) {
          return intCurrency(intVal, true, scope.$parent.dbCtrl.currencyDigits);
        }

        function generateReport() {
          const currency = $filter("currency"),
            dateFilter = $filter("date"),
            report = netWorth(scope.transactions);

          var ctx = element[0].getContext("2d");

          var barChartData = {
            labels: report.months,
            datasets: [
              {
                label: $translate.instant("NET_WORTH"),
                type: "line",
                borderColor: "rgba(136, 136, 136, 1)",
                borderWidth: 1,
                tension: 0,
                data: report.netWorth.map((amt) => getCurrencyValue(amt)),
                fill: true,
                radius: 0,
                mode: 'nearest',
                backgroundColor: "rgba(255, 255, 0, 0.1)",
                pointHoverBorderWidth: 1,
                pointHoverBorderColor: "rgba(136, 136, 136, 1)",
                pointHoverRadius: 4, 
              },
              {
                type: "bar",
                label: $translate.instant("DEBTS"),
                data: report.debt.map((amt) => getCurrencyValue(amt)),
                fill: false,
                backgroundColor: "#ff4c4c",
                borderColor: "#ff4c4c",
                hoverBackgroundColor: "#ff4c4c",
                hoverBorderColor: "#ff4c4c",
              },
              {
                type: "bar",
                label: $translate.instant("ASSETS"),
                data: report.assets.map((amt) => getCurrencyValue(amt)),
                fill: false,
                backgroundColor: "#93c776",
                borderColor: "#93c776",
                hoverBackgroundColor: "#93c776",
                hoverBorderColor: "#93c776",
              },
            ],
          };

          new Chart(ctx, {
            type: "bar",
            data: barChartData,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
              },
              plugins: {
                tooltip: {
                  mode: "index",
                  callbacks: {
                    title: function (context) {
                      return capitalize(dateFilter(report.months[context[0].dataIndex], "MMM ''yy"));
                    },
                    label: function (context) {
                      const dataset = context.dataset;
                      const value = context.parsed.y;
                      console.log(context)
                      
                      return (
                        dataset.label +
                        ": " +
                        currency(
                          value,
                          scope.$parent.dbCtrl.currencySymbol,
                          scope.$parent.dbCtrl.currencyDigits,
                        )
                      );
                    },
                    labelColor: function (context) {
                      if (context.datasetIndex === 0) return {backgroundColor: "rgba(0, 0, 0, 1)"}
                    }
                  },
                },
                legend: {
                  display: false,
                },
              },
              elements: {
                line: {
                  fill: false,
                },
              },
              scales: {
                x: {
                    display: true,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      callback: (date) => {
                        return capitalize(dateFilter(report.months[date], "MMM ''yy"));
                      },
                    },
                  },
                y: {
                    display: true,
                    grid: {
                      display: true,
                    },
                    ticks: {
                      beginAtZero: true,
                      callback: (amount) => {
                        return currency(
                          amount,
                          scope.$parent.dbCtrl.currencySymbol,
                          scope.$parent.dbCtrl.currencyDigits,
                        );
                      },
                    },
                  },
              },
            },
          });
        }
      },
    };
  });
